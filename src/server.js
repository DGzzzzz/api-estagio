import 'dotenv/config';
import app from "./App.js";

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running.`)
});
