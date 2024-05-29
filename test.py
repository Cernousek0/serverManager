import docker

# Initialize Docker client
client = docker.from_env()

# Replace 'minecraft_server' with the name or ID of your container
container = client.containers.get('mc-server')

# Run the 'list' command to get the list of players
result = container.exec_run('minecraft-command-to-get-players')

# Decode the output (result is a tuple, we take the second element which is the output)
player_list = result.output.decode('utf-8')
print(player_list)
