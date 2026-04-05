// ------------------- ROUTES ------------------- //
app.use("/api/users", userRouter);
app.use("/api/items", itemsRouter);
app.use("/api/materials", materialsRouter);
app.use("/api/connect", connectRoutes);
app.use("/api/answers", answerRouter);
app.use("/api/reviews", reviewRoutes);

// NEW: Add a specific Root Route for Render's Health Check
app.get("/", (req, res) => {
  res.status(200).send("Campus Connect API is Live!");
});

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    // ONLY ONE LISTEN COMMAND HERE
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); 
  });

// REMOVED: The extra app.listen that was at the very bottom