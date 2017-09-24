module.exports = {
  apps : [
    {
      name: "main",
      script: "./server/main.js",
      watch: true,
      env: {
        "NODE_ENV": "production",
        "PORT": "8080",
        "MONGODB_URI": "mongodb://localhost/heroku_wkb9m7x7",
        "JWT_SECRET": "q7r2ZBFtEA1kWcqkFvGQoKtC1qYrH2Mf",
        "MASTER_KEY": "3wIVZfXVtXLHvXX6ZbYzRCnPzKe7fWtP",
        "SENDGRID_KEY": "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"
      }
    }
  ]
}