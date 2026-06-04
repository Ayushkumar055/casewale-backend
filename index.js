const express = require("express")
const cors = require("cors")
const prisma = require("./src/config/prisma")
const news = require("./Data/news")
const app = express();
const PORT = 3000
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Welcome to the News API")
})
app.get("/name", (req, res) => {
    res.send("My name is Ayush")
})
app.get("/home", (req, res) => {
    res.send("Welcome to the home page")
})
app.get("/about", (req, res) => {
    res.send("This is the about page")
})
app.get("/services", (req, res) => {
    res.send("This is the services page")
})
app.get("/faq", (req, res) => {
    res.send("This is the FAQ page")
})
app.get("/Main_Page", (req, res) => {
    res.send("Welcome to the news Page")
})
app.get("/news", (req, res) => {
    const category = req.query.category;
    const limit = parseInt(req.query.limit);
    let result = news;
    if (category) {
        result = news.filter(item => item.category.toLowerCase() === category.toLowerCase())
        if (result.length === 0) return res.status(404).json({ message: `No news found for category '${category}'` })
    }
    if (!isNaN(limit) && limit > 0) result = result.slice(0, limit)
    return res.json(result)
})
app.get("/news/categories", (req, res) => {
    const categories = [...new Set(news.map(item => item.category))]
    res.json({ total: categories.length, categories })
})
app.get("/news/search/:term", (req, res) => {
    const term = req.params.term.toLowerCase()
    const results = news.filter(item => item.news.toLowerCase().includes(term))
    if (results.length === 0) return res.status(404).json({ message: `No news found for: "${term}"` })
    res.json({ term, count: results.length, articles: results })
})
app.get("/news/category/:category", (req, res) => {
    const category = req.params.category.toLowerCase()
    const filtered = news.filter(item => item.category === category)
    if (filtered.length === 0) return res.status(404).json({ message: `No news found for category: "${category}"` })
    res.json({ category, count: filtered.length, articles: filtered })
})
app.get("/news/category/:category/top/:n", (req, res) => {
    const category = req.params.category.toLowerCase()
    const n = parseInt(req.params.n)
    if (isNaN(n) || n <= 0) return res.status(400).json({ message: "Please provide a valid number" })
    const filtered = news.filter(item => item.category === category).slice(0, n)
    if (filtered.length === 0) return res.status(404).json({ message: `No news found for category: "${category}"` })
    res.json({ category, count: filtered.length, articles: filtered })
})
app.get("/news/top/:n", (req, res) => {
    const n = parseInt(req.params.n)
    if (isNaN(n) || n <= 0) return res.status(400).json({ message: "Please provide a valid number" })
    res.json(news.slice(0, n))
})
app.get("/news/:id", (req, res) => {
    const item = news.find(n => n.id === parseInt(req.params.id))
    if (!item) return res.status(404).json({ message: "News not found" })
    res.json(item)
})
app.post("/signup", (req, res) => {
    const body = req.body
    console.log(body)
    res.send(body)
})
app.post("/users", async (req, res) => {
    try {
        const { email, name } = req.body;
        const user = await prisma.user.create({
            data: { email, name }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.get("/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})