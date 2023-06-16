# %%
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from ta.momentum import RSIIndicator
from ta.trend import ADXIndicator, CCIIndicator
from bot.scripts.indicators import wave_trend

# %%
from dotenv import load_dotenv

load_dotenv('bot/.env')

# %%
from bot.db.main_db import FinanceDB

db = FinanceDB.Instance(schema='crypto').pg_db

# %%
df = (
    db.query_df("select * from finance.crypto.crypto_bars where symbol='ETH/USD' ORDER BY timestamp;")
    .assign(**{
        'rsi': lambda x: RSIIndicator(x.close, window=14).rsi(),
        'adx': lambda x: ADXIndicator(x.high, x.low, x.close, window=14).adx(),
        'cci': lambda x: CCIIndicator(x.high, x.low, x.close, window=20).cci(),
    })
    .dropna()
    .set_index('timestamp')
)

# df['wt'] = wave_trend(df)['diff']
#   math.log(1+math.abs(featureSeries.f1 - array.get(featureArrays.f1, i))) +
#   math.log(1+math.abs(featureSeries.f2 - array.get(featureArrays.f2, i))) +
#   math.log(1+math.abs(featureSeries.f3 - array.get(featureArrays.f3, i)))


# %%
X = df[['rsi', 'adx', 'cci']].values
scaler = StandardScaler()
X2 = scaler.fit_transform(X)

# %%
origin = X2[-1]

# %%
lorentz_coordinates = np.log(1 + np.abs(X2 - origin))

# %%
euclidean_coordinates = X2 - origin


# %%
def lorentzian_distance(x, y):
    return np.sum(np.log(1 + np.abs(x - y)))
    # return np.log(1 + np.sum(np.abs(x - y)))


# %%
def euclidean_distance(vector1, vector2):
    return np.sqrt(np.sum(np.power(vector1 - vector2, 2)))


# %%
# create a 3d plot of the lorentz coordinates
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D

# %%
fig = plt.figure()
ax = fig.add_subplot(projection='3d')
for i, coord in enumerate(lorentz_coordinates):
    ax.scatter(coord[0], coord[1], coord[2])
plt.show()

# %%
fig = plt.figure()
ax = fig.add_subplot(projection='3d')
for i, coord in enumerate(euclidean_coordinates):
    ax.scatter(coord[0], coord[1], coord[2])

# Make a 3D quiver plot
x, y, z = np.array([[-1.5, 0, 0], [0, -1.5, 0], [0, 0, -1.5]])
u, v, w = np.array([[3, 0, 0], [0, 3, 0], [0, 0, 3]])
ax.quiver(x, y, z, u, v, w, arrow_length_ratio=0.1, color="black")
ax.grid(False)
ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_zlabel('Z')

plt.show()

# %%
import plotly.express as px

df_plot = pd.DataFrame(lorentz_coordinates, columns=['rsi', 'adx', 'cci'])
# create 3d plotly plot
fig = px.scatter_3d(df_plot, x='rsi', y='adx', z='cci')
fig.show()

# %%
origin = df.iloc[-1][['rsi', 'adx', 'cci']]

# %%
Y = np.where(df.close.shift(-1) > df.close, 1, -1)

# %%
split_percentage = 0.7
split = int(split_percentage * len(df))
X_train = X[:split]
Y_train = Y[:split]
X_test = X[split:]
Y_test = Y[split:]

# %%
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# %%
knn = KNeighborsClassifier(n_neighbors=10, metric=lorentzian_distance)

# %%
knn.fit(X_train, Y_train)

# %%
accuracy_train = knn.score(X_train, Y_train)
accuracy_test = knn.score(X_test, Y_test)
print(f'Train Accuracy: {accuracy_train}')
print(f'Test Accuracy: {accuracy_test}')
