module.exports = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Admin access required" });
        }

        next();

    } catch (error) {
        res.status(500).json({ message: "Admin middleware error" });
    }
};
