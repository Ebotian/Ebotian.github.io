---
date: 2023-01-01
---

# DOCKER 总结

dockerID：asilena
pwd：Yibotian123###
run the code in the shell to login：

```shell
sudo docker login
```

[optional]better su to  the root user by

```shell
su root
```

and enter the ID&&password mentioned upon

```shell
docker container run <container_name> <command_ran_in_the_container>
```

for more common

```shell
docker <management_commands> <the_others>...
```

* So Docker is just a tool like git for quickly sync work but with envirnment.
* Systematic learning isn't needed, just like git, whenever you need a function,search it in the Internet.
* Docker provide two useful things:<font color=skyblue>image</font> and container, and tools to use them:network to link containers so muti-containers could work together, thus many basic containers can be use like mysql,ubuntu(and other linux distro)
But i think should list some useful commands:

```shell
docker container ls --all(add "--all" to show all include stpped containers. I always forget to delete them)
docker run --detach(-d) --name <container_name>(if_don't_add "--name<container_name>", the name will be randomly given)
```

<!-- markdownlint-configure-file {
  "no-inline-html": {
    "allowed_elements": [
      "a"
    ]
  }
} -->
