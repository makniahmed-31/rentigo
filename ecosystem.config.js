module.exports = {
  apps: [
    {
      name: "rentigo-client",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      watch: false,
      restart_delay: 3000,
      max_restarts: 10,
    },
  ],
};
