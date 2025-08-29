import fs from "fs";
import path from "path";

export const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        if (!email) {
            return res.status(400).json({
                status: 6001,
                message: "Email is required"
            });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: 6001,
                message: "Please provide a valid email address"
            });
        }

        // Define the file path for storing emails
        const emailsFilePath = path.join(process.cwd(), 'server/newsletter-subscribers.txt');

        // Check if email already exists
        let existingEmails = '';
        if (fs.existsSync(emailsFilePath)) {
            existingEmails = fs.readFileSync(emailsFilePath, 'utf8');
            if (existingEmails.includes(email)) {
                return res.status(400).json({
                    status: 6001,
                    message: "Email is already subscribed"
                });
            }
        }

        // Append email to file with timestamp
        const timestamp = new Date().toISOString();
        const emailEntry = `${email} - ${timestamp}\n`;

        fs.appendFileSync(emailsFilePath, emailEntry);

        res.status(200).json({
            status: 6000,
            message: "Successfully subscribed to newsletter!"
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({
            status: 6001,
            message: "Failed to subscribe. Please try again."
        });
    }
};

export const getSubscribers = async (req, res) => {
    try {
        const emailsFilePath = path.join(process.cwd(), 'server/newsletter-subscribers.txt');

        if (!fs.existsSync(emailsFilePath)) {
            return res.status(200).json({
                status: 6000,
                subscribers: [],
                total: 0
            });
        }

        const emailsContent = fs.readFileSync(emailsFilePath, 'utf8');
        const emailLines = emailsContent.trim().split('\n').filter(line => line.length > 0);

        const subscribers = emailLines.map(line => {
            const [email, timestamp] = line.split(' - ');
            return {
                email: email?.trim(),
                subscribedAt: timestamp?.trim()
            };
        });

        res.status(200).json({
            status: 6000,
            subscribers,
            total: subscribers.length
        });

    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({
            status: 6001,
            message: "Failed to get subscribers"
        });
    }
};
