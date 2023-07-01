import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendWelcomeEmail = (email, name) => {
    console.log('Sending sendWelcomeEmail to:', email);
    sgMail.send({
        to: email,
        from: 'info@renect.co.uk',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    }).catch(err => {
        console.log('====================================');
        console.log(`Cannot send emails due to: ${err.message}`);
        console.log('====================================');
    });
}

export const sendCancelationEmail = (email, name) => {
    console.log('Sending sendCancelationEmail to:', email);
    sgMail.send({
        to: email,
        from: 'info@renect.co.uk',
        subject: 'We are sorry to see you leaving!',
        html: `<h4>Hey ${name},</h4> <br /> 
            <p> We are sorry to see you leaving. Is there anything we could've done to keep you?</p>`
    }).catch(err => {
        console.log('====================================');
        console.log(`Cannot send emails due to: ${err.message}`);
        console.log('====================================');
    });
}
