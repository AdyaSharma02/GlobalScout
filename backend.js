const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const mysql = require('mysql');
const session = require('express-session');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

app.use('/styles', express.static('styles'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Setup Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let conversationHistory = [];

// MySQL configuration
const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'global_scout',
    debug: false
}); 

//------------------------------------------------------------------------------------------------------------------------------------------------------

// Chatbox endpoint
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    conversationHistory.push({
        role: "user",
        parts: [{ text: userMessage }],
    });

    try {
        const chat = model.startChat({ history: conversationHistory });
        let result = await chat.sendMessage(userMessage);
        conversationHistory.push({
            role: "model",
            parts: [{ text: result.response.text() }],
        });

        const formattedResponse = result.response.text()
            .replace(/\\(.+?)\\/g, '<b>$1</b>')  // Bold text within \\
            .replace(/\((.*?)\)\*/g, '<i>$1</i>') // Italic text within ()
            .replace(/\n/g, '<br>');              // Newline to <br>

        res.json({ response: formattedResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//------------------------------------------------------------------------------------------------------------------------------------------------------

// Global Scout endpoints
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
 
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/feedback', (req, res) => {
    res.sendFile(path.join(__dirname, 'feedback.html'));
});

app.get('/about1', (req, res) => {
    res.sendFile(path.join(__dirname, 'about1.html'));
});

app.get('/contact1', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact1.html'));
});

app.get('/feedback1', (req, res) => {
    res.sendFile(path.join(__dirname, 'feedback1.html'));
});

app.get('/japan', (req, res) => {
    res.sendFile(path.join(__dirname, 'japan.html'));
});

app.get('/korea', (req, res) => {
    res.sendFile(path.join(__dirname, 'korea.html'));
});

app.get('/indonesia', (req, res) => {
    res.sendFile(path.join(__dirname, 'indonesia.html'));
});

app.get('/vietnam', (req, res) => {
    res.sendFile(path.join(__dirname, 'vietnam.html'));
});

//------------------------------------------------------------------------------------------------------------------------------------------------------

// signup endpoint
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Insert user data into the database
    pool.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password],
        (error, results) => {
            if (error) {
                console.error('Error inserting data into the database:', error);
                // Send a professional error message to the client
                return res.status(500).send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Sign-Up Error</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-light">
                        <div class="container">
                            <div class="row justify-content-center mt-5">
                                <div class="col-md-8">
                                    <div class="card">
                                        <div class="card-header bg-danger text-white">
                                            <h4 class="mb-0">An Error Occurred During Sign-Up</h4>
                                        </div>
                                        <div class="card-body">
                                            <p class="mb-2"><strong>Error Code:</strong> ${error.code}</p>
                                            <p class="mb-2"><strong>Error Number:</strong> ${error.errno}</p>
                                            <p class="mb-2"><strong>SQL Message:</strong> ${error.sqlMessage}</p>
                                            <p class="mb-4"><strong>SQL State:</strong> ${error.sqlState}</p>
                                            <a href="/" class="btn btn-primary">Go back to the Index page and Login</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
                    </body>
                    </html>
                `);
            }
            console.log('User signed up successfully');

            // Retrieve the entire user object from the database
            pool.query(
                'SELECT * FROM users WHERE email = ?',
                [email],
                (error, results) => {
                    if (error) {
                        console.error('Error retrieving user data:', error);
                        return res.status(500).send(`
                            <!DOCTYPE html>
                            <html lang="en">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>Data Retrieval Error</title>
                                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                            </head>
                            <body class="bg-light">
                                <div class="container">
                                    <div class="row justify-content-center mt-5">
                                        <div class="col-md-8">
                                            <div class="card">
                                                <div class="card-header bg-warning text-dark">
                                                    <h4 class="mb-0">Data Retrieval Error</h4>
                                                </div>
                                                <div class="card-body">
                                                    <p class="mb-2"><strong>Error Code:</strong> ${error.code}</p>
                                                    <p class="mb-2"><strong>Error Number:</strong> ${error.errno}</p>
                                                    <p class="mb-2"><strong>SQL Message:</strong> ${error.sqlMessage}</p>
                                                    <p class="mb-4"><strong>SQL State:</strong> ${error.sqlState}</p>
                                                    <a href="/" class="btn btn-primary">Go back to the Index page and Login</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
                            </body>
                            </html>
                        `);
                    }
                    const user = results[0];
                    req.session.user = user; // Store the entire user object in the session
                    res.redirect('/index2'); // Redirect to index2
                }
            );
        }
    );
});

//------------------------------------------------------------------------------------------------------------------------------------------------------

// login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Query the database to find the user
    pool.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (error, results) => {
            if (error) {
                console.error('Error querying the database:', error);
                return res.status(500).send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Login Error</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-light">
                        <div class="container">
                            <div class="row justify-content-center mt-5">
                                <div class="col-md-8">
                                    <div class="alert alert-warning" role="alert">
                                        <h4 class="alert-heading">Server Error</h4>
                                        <p>We encountered an issue while processing your login request. Please try again later.</p>
                                        <hr>
                                        <p class="mb-0">If the problem persists, contact our support team.</p>
                                    </div>
                                    <a href="/" class="btn btn-primary mt-3">Go back to the Index page</a>
                                </div>
                            </div>
                        </div>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
                    </body>
                    </html>
                `);
            }

            if (results.length > 0) {
                // User found, redirect to index2.html
                req.session.user = results[0]; // Store user data in session if needed
                res.redirect('/index2');
            } 
            else {
                // User not found
                return res.status(401).send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Login Error</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-light">
                        <div class="container">
                            <div class="row justify-content-center mt-5">
                                <div class="col-md-8">
                                    <div class="alert alert-danger" role="alert">
                                        <h4 class="alert-heading">Invalid Login</h4>
                                        <p>The email or password you entered is incorrect. Please try again.</p>
                                    </div>
                                    <a href="/" class="btn btn-primary mt-3">Go back to the Index page</a>
                                </div>
                            </div>
                        </div>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
                    </body>
                    </html>
                `);
            }
        }
    );
});

//------------------------------------------------------------------------------------------------------------------------------------------------------

// account endpoint
app.get('/account', (req, res) => {
    const user = req.session.user;

    if (user) {
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Details</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    body {
                        background-color: #f8f9fa;
                        padding: 50px;
                    }
                    .table-container {
                        max-width: 600px;
                        margin: auto;
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h2 {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    table {
                        width: 100%;
                    }
                    th {
                        background-color: #007bff;
                        color: white;
                    }
                </style>
            </head>
            <body>
                <div class="table-container">
                    <h2>ACCOUNT DETAILS</h2>
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Field</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>ID</td>
                                <td>${user.id}</td>
                            </tr>
                            <tr>
                                <td>Username</td>
                                <td>${user.username}</td>
                            </tr>
                            <tr>
                                <td>Email</td>
                                <td>${user.email}</td>
                            </tr>
                            <tr>
                                <td>Password</td>
                                <td>${user.password}</td>
                            </tr>
                            <tr>
                                <td>Created At</td>
                                <td>${user.created_at}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>
        `);
    } else {
        res.status(401).send('User not logged in');
    }
});

//------------------------------------------------------------------------------------------------------------------------------------------------------

// index2 endpoint
app.get('/index2', (req, res) => {
    console.log('Serving index2.html');
    res.sendFile(path.join(__dirname, 'index2.html'), (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        }
    });
});

//------------------------------------------------------------------------------------------------------------------------------------------------------

// contact1 endpoint
app.post('/contact1-submit', (req, res) => {
    const { name, email, subject, message } = req.body;

    // Insert contact form data into the database
    pool.query(
        'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
        [name, email, subject, message],
        (error, results) => {
            if (error) {
                console.error('Error inserting contact data into the database:', error);
                return res.status(500).send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Contact Submission Error</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-light">
                        <div class="container">
                            <div class="row justify-content-center mt-5">
                                <div class="col-md-8">
                                    <div class="card">
                                        <div class="card-header bg-danger text-white">
                                            <h4 class="mb-0">An Error Occurred</h4>
                                        </div>
                                        <div class="card-body">
                                            <p class="mb-2"><strong>Error Code:</strong> ${error.code}</p>
                                            <p class="mb-2"><strong>Error Number:</strong> ${error.errno}</p>
                                            <p class="mb-2"><strong>SQL Message:</strong> ${error.sqlMessage}</p>
                                            <p class="mb-4"><strong>SQL State:</strong> ${error.sqlState}</p>
                                            <a href="/contact1" class="btn btn-primary">Go back to the Contact page</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
                    </body>
                    </html>
                `);
            }

            console.log('Contact form submitted successfully');
            res.redirect('/contact1-success');
        }
    );
});

app.get('/contact1-success', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Submission Success</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    background-color: #f8f9fa;
                    font-family: 'Arial', sans-serif;
                }
                .success-card {
                    margin-top: 50px;
                }
                .btn-back {
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card success-card shadow-sm">
                            <div class="card-header bg-success text-white">
                                <h4 class="mb-0">Success!</h4>
                            </div>
                            <div class="card-body text-center">
                                <h5 class="card-title">Thank You for Your Message</h5>
                                <p class="card-text">We have received your message and will get back to you shortly.</p>
                                <a href="/" class="btn btn-primary btn-back">Return to Home</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `);
});

//------------------------------------------------------------------------------------------------------------------------------------------------------

//contact endpoint
app.get('/contact', (req, res) => {
    if (req.session.user) {  // Check if user data exists in the session
        const { username, email } = req.session.user;  // Fetch data from the session
        res.render('contact', { username, email });  // Pass the data to contact.ejs
    } else {
        res.redirect('/login'); // Redirect to login if the user is not authenticated
    }
});

app.post('/contact-submit', (req, res) => {
    const { name, email, subject, message } = req.body; // Ensure 'name' is not NULL

    // Insert contact form data into the database
    pool.query(
        'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
        [name, email, subject, message],
        (error, results) => {
            if (error) {
                console.error('Error inserting contact data into the database:', error);
                return res.status(500).send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Contact Submission Error</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                    </head>
                    <body class="bg-light">
                        <div class="container">
                            <div class="row justify-content-center mt-5">
                                <div class="col-md-8">
                                    <div class="card">
                                        <div class="card-header bg-danger text-white">
                                            <h4 class="mb-0">An Error Occurred</h4>
                                        </div>
                                        <div class="card-body">
                                            <p class="mb-2"><strong>Error Code:</strong> ${error.code}</p>
                                            <p class="mb-2"><strong>Error Number:</strong> ${error.errno}</p>
                                            <p class="mb-2"><strong>SQL Message:</strong> ${error.sqlMessage}</p>
                                            <p class="mb-4"><strong>SQL State:</strong> ${error.sqlState}</p>
                                            <a href="/contact" class="btn btn-primary">Go back to the Contact page</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
                    </body>
                    </html>
                `);
            }

            console.log('Contact form submitted successfully');
            res.redirect('/contact-success');
        }
    );
});

app.get('/contact-success', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Contact Submission Success</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body {
                    background-color: #f8f9fa;
                    font-family: 'Arial', sans-serif;
                }
                .success-card {
                    margin-top: 50px;
                }
                .btn-back {
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-8">
                        <div class="card success-card shadow-sm">
                            <div class="card-header bg-success text-white">
                                <h4 class="mb-0">Success!</h4>
                            </div>
                            <div class="card-body text-center">
                                <h5 class="card-title">Thank You for Your Message</h5>
                                <p class="card-text">We have received your message and will get back to you shortly.</p>
                                <a href="/index2" class="btn btn-primary btn-back">Return to Home</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        </body>
        </html>
    `);
});

//------------------------------------------------------------------------------------------------------------------------------------------------------

// hotel booking endpoint
app.get('/booking', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    pool.query('SELECT * FROM hotels', (error, results) => {
        if (error) {
            console.error('Error fetching hotels:', error);
            return res.status(500).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - Hotel Booking</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .error-page {
            text-align: center;
            padding: 50px;
        }
        .error-message {
            font-size: 1.25rem;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container error-page">
        <h1 class="display-4">Oops!</h1>
        <p class="error-message">Something went wrong while fetching the hotels. Please try again later.</p>
        <a href="/index2" class="btn btn-primary">Return to Home</a>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
            `);
        }

        res.render('booking', {
            user: req.session.user,
            hotels: results
        });
    });
});


//------------------------------------------------------------------------------------------------------------------------------------------------------

// Hotels Fetch Endpoint
app.get('/hotels', (req, res) => {
    const countryOfTravel = req.query.country;

    if (!countryOfTravel) {
        return res.status(400).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bad Request - Hotels</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .error-page {
            text-align: center;
            padding: 50px;
        }
        .error-message {
            font-size: 1.25rem;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container error-page">
        <h1 class="display-4">Bad Request</h1>
        <p class="error-message">The country parameter is required to fetch hotels. Please provide a country and try again.</p>
        <a href="/index2" class="btn btn-primary">Return to Home</a>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
        `);
    }

    pool.query('SELECT * FROM hotels WHERE country_of_travel = ?', [countryOfTravel], (error, results) => {
        if (error) {
            console.error('Error fetching hotels:', error);
            return res.status(500).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Error - Hotels</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .error-page {
            text-align: center;
            padding: 50px;
        }
        .error-message {
            font-size: 1.25rem;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container error-page">
        <h1 class="display-4">Server Error</h1>
        <p class="error-message">An error occurred while fetching the hotels. Please try again later.</p>
        <a href="/index2" class="btn btn-primary">Return to Home</a>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
            `);
        }

        res.json({ hotels: results });
    });
});


//------------------------------------------------------------------------------------------------------------------------------------------------------

// Booking Post Endpoint
app.post('/book-hotel', (req, res) => {
    const { username, email, country, mobile, travel_country, hotel, checkin_date, checkout_date, guests } = req.body;

    if (!req.session.user) {
        return res.status(401).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unauthorized - Booking</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .error-page {
            text-align: center;
            padding: 50px;
        }
        .error-message {
            font-size: 1.25rem;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container error-page">
        <h1 class="display-4">Unauthorized</h1>
        <p class="error-message">You must be logged in to book a hotel. Please log in and try again.</p>
        <a href="/login" class="btn btn-primary">Login</a>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
        `);
    }

    const sessionUser = req.session.user;
    if (username !== sessionUser.username || email !== sessionUser.email) {
        return res.status(400).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bad Request - Booking</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .error-page {
            text-align: center;
            padding: 50px;
        }
        .error-message {
            font-size: 1.25rem;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container error-page">
        <h1 class="display-4">Bad Request</h1>
        <p class="error-message">The provided username or email does not match the logged-in user. Please check your details and try again.</p>
        <a href="/booking" class="btn btn-primary">Back to Booking</a>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
        `);
    }

    if (!hotel) {
        return res.status(400).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bad Request - Booking</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .error-page {
            text-align: center;
            padding: 50px;
        }
        .error-message {
            font-size: 1.25rem;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container error-page">
        <h1 class="display-4">Bad Request</h1>
        <p class="error-message">Hotel is a required field. Please select a hotel and try again.</p>
        <a href="/booking" class="btn btn-primary">Back to Booking</a>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
        `);
    }

    pool.query(
        'INSERT INTO booking (user_id, username, email, country_region, mobile_number, country_of_travel, hotel, check_in_date, check_out_date, number_of_guests) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [sessionUser.id, username, email, country, mobile, travel_country, hotel, checkin_date, checkout_date, guests],
        (error, results) => {
            if (error) {
                console.error('Error inserting booking data:', error);
                return res.status(500).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Error - Booking</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .error-page {
            text-align: center;
            padding: 50px;
        }
        .error-message {
            font-size: 1.25rem;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container error-page">
        <h1 class="display-4">Server Error</h1>
        <p class="error-message">An error occurred while processing your booking. Please try again later.</p>
        <a href="/booking" class="btn btn-primary">Back to Booking</a>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
            `);
            }

            res.redirect('/booking-confirmation');
        }
    );
});


//------------------------------------------------------------------------------------------------------------------------------------------------------

// Booking Confirmation Route
app.get('/booking-confirmation', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .confirmation-page {
            text-align: center;
            padding: 50px;
        }
        .confirmation-message {
            font-size: 1.5rem;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container confirmation-page">
        <div class="confirmation-message">
            <h1>Thank You for Choosing Us!</h1>
            <p>Your booking has been confirmed. We appreciate your business and look forward to serving you.</p>
        </div>
        <a href="/index2" class="btn btn-primary">Return to Home</a>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
    `);
});

//------------------------------------------------------------------------------------------------------------------------------------------------------

// Feedback Endpoint
app.post('/submit-feedback', (req, res) => {
  const { feedbackType, message, rating } = req.body;

  // Validate input
  if (!feedbackType || !message || !rating) {
    return res.status(400).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invalid Input - Feedback</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .error-page {
            text-align: center;
            padding: 50px;
        }
        .error-message {
            font-size: 1.25rem;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container error-page">
        <h1 class="display-4">Invalid Input</h1>
        <p class="error-message">All fields are required. Please provide feedback type, message, and rating.</p>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
    `);
  }

  // Insert feedback into database
  const query = `INSERT INTO feedback (feedback_type, message, rating) VALUES (?, ?, ?)`;
  pool.query(query, [feedbackType, message, rating], (err, results) => {
    if (err) {
      console.error('Error inserting feedback:', err); // Log detailed error
      return res.status(500).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Error - Feedback</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .error-page {
            text-align: center;
            padding: 50px;
        }
        .error-message {
            font-size: 1.25rem;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container error-page">
        <h1 class="display-4">Server Error</h1>
        <p class="error-message">An error occurred while submitting your feedback. Please try again later.</p>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
      `);
    }

    // Redirect to the thank you page after successful feedback submission
    res.redirect('/feedback-success');
  });
});


// Feedback Success Page
app.get('/feedback-success', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feedback Submitted</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .success-page {
            text-align: center;
            padding: 50px;
        }
        .success-message {
            font-size: 1.25rem;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container success-page">
        <h1 class="display-4">Feedback Submitted</h1>
        <p class="success-message">Thank you for your feedback! We appreciate your input.</p>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
  `);
});

//------------------------------------------------------------------------------------------------------------------------------------------------------

// all feedback table endpoint
app.get('/allfeedback', (req, res) => {
  // Query to get all feedback from the database
  const query = 'SELECT * FROM feedback ORDER BY created_at DESC';
  
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving feedback:', err); // Log detailed error
      return res.status(500).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Error - Feedback</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .error-page {
            text-align: center;
            padding: 50px;
        }
        .error-message {
            font-size: 1.25rem;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container error-page">
        <h1 class="display-4">Server Error</h1>
        <p class="error-message">An error occurred while retrieving feedback. Please try again later.</p>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
      `);
    }

    // Generate HTML table from feedback results
    let feedbackTable = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Feedback - Global Scout</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        .table-container {
            margin: 20px;
        }
        .feedback-table th, .feedback-table td {
            text-align: center;
            vertical-align: middle;
        }
        .feedback-table th {
            background-color: #007bff;
            color: #ffffff;
        }
        .feedback-table tbody tr:nth-child(odd) {
            background-color: #f2f2f2;
        }
        .feedback-table tbody tr:hover {
            background-color: #e0e0e0;
        }
        .table-responsive {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container table-container">
        <h1 class="text-center">Global Scout Feedback Overview</h1>
        <div class="table-responsive">
            <table class="table table-striped feedback-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Feedback Type</th>
                        <th>Message</th>
                        <th>Rating</th>
                        <th>Date Submitted</th>
                    </tr>
                </thead>
                <tbody>`;

    results.forEach(feedback => {
        feedbackTable += `
                <tr>
                    <td>${feedback.id}</td>
                    <td>${feedback.feedback_type}</td>
                    <td>${feedback.message}</td>
                    <td>${feedback.rating}</td>
                    <td>${new Date(feedback.created_at).toLocaleDateString()}</td>
                </tr>`;
    });

    feedbackTable += `
                </tbody>
            </table>
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.3/dist/umd/popper.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>`;

    res.send(feedbackTable);
  });
});


//------------------------------------------------------------------------------------------------------------------------------------------------------

// Destroy the session to log the user out
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

//------------------------------------------------------------------------------------------------------------------------------------------------------

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
