nodenagios-server
=================

A sort of agent for monitoring servers with Nagios.

Requires Node.js to run the agent, for Windows you also will need to
downloadn sysinternals suite.

Don't forget to configure config.js before running it with node agent.js, you
can also pass an argument with a different config file.

Modules right now:
- df: test free space on a given partition
    - linux: tested on RHEL 6
    - windows: tested on XP (use drive: with upper case)
- queryservice: query on a win platform the status of a given service
- cpu: check cpu usage
    - linux: tested on RHEL6
- perfmon: query perfmon monitors on windows, you need to know which counter retrieve and which index, you can check it with "typeperf -q" and then with "typeperf -sc 1 counter" to check which index do you need.
