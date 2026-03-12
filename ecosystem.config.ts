module.exports = {
    apps: [
  
      {
        name: "order-service",
        script: "./order-service/src/index.ts",
        cwd: "./order-service",
        instances: 1,
        exec_mode: "fork",
        env: {
          PORT: 4001,
          NODE_ENV: "production"
        }
      },
  
      {
        name: "product-service",
        script: "./product-service/src/index.ts",
        cwd: "./product-service",
        instances: 1,
        exec_mode: "fork",
        env: {
          PORT: 4002,
          NODE_ENV: "production"
        }
      },
  
      {
        name: "user-service",
        script: "./user-service/src/index.ts",
        cwd: "./user-service",
        instances: 1,
        exec_mode: "fork",
        env: {
          PORT: 4003,
          NODE_ENV: "production"
        }
      },
  
      {
        name: "api-gateway",
        script: "./api-gateway/src/index.ts",
        cwd: "./api-gateway",
        instances: 1,
        exec_mode: "fork",
        env: {
          PORT: 4000,
          NODE_ENV: "production"
        }
      }
    ]
  }