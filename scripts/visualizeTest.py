import sklearn
import pandas as pd

df_status_matrix = pd.read_csv('data/W.csv')
df_status_matrix = df_status_matrix.set_index('Unnamed: 0')
df_status_matrix.index.rename('Status Matrix: W', inplace=True)
print(df_status_matrix)

df_group_matrix = pd.read_csv('data/group.csv')
df_group_matrix = df_group_matrix.set_index('Unnamed: 0')
df_group_matrix.index.rename('Group Matrix', inplace=True)
print(df_group_matrix)

#PCA time
print(test)

import plotly.express as px
fig = px.imshow(df_status_matrix)
fig.show()