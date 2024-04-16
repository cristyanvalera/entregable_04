const catchError = require('../utils/catchError');
const User = require('../models/User');
const { sendEmail } = require('../utils/sendEmail');
const bcrypt = require('bcrypt');

const index = catchError(async (request, response) => {
    const results = await User.findAll();

    return response.json(results);
});

const create = catchError(async (request, response) => {
    const { email, firstName, frontBaseUrl, password } = request.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await User.create({ ...request.body, password: hashedPassword });
    
    sendEmailToUser(email, firstName, frontBaseUrl);

    return response.status(201).json(result);
});

const show = catchError(async (request, response) => {
    const { id } = request.params;

    const result = await User.findByPk(id);

    if (!result) return response.sendStatus(404);

    return response.json(result);
});

const destroy = catchError(async (request, response) => {
    const { id } = request.params;

    const result = await User.destroy({ where: { id } });

    if (!result) return response.sendStatus(404);

    return response.sendStatus(204);
});

const update = catchError(async (request, response) => {
    const { id } = request.params;

    const result = await User.update(
        request.body,
        { where: { id }, returning: true }
    );

    if (result[0] === 0) return response.sendStatus(404);

    return response.json(result[1][0]);
});

const sendEmailToUser = (email, firstName, frontBaseUrl) => {
    const code = require('crypto').randomBytes(64).toString('hex');

    sendEmail({
        to: email,
        subject: 'Verify password',
        html: `
            <div style="max-width: 500px; margin: 50px auto; background-color: #f8fafc; padding: 30px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); font-family: 'Arial', sans-serif; color: #333333;">
                <h1 style="color: #007BFF; font-size: 28px; text-align: center; margin-bottom: 20px;">¡Hola ${firstName?.toUpperCase()} 👋!</h1>    
                <p style="font-size: 18px; line-height: 1.6; margin-bottom: 25px; text-align: center;">Gracias por registrarte en nuestra aplicación. Para verificar su cuenta, haga clic en el siguiente enlace:</p>
                <div style="text-align: center;">
                    <a href="${frontBaseUrl}/verify_email/${code}" style="display: inline-block; background-color: #007BFF; color: #ffffff; text-align: center; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 18px;">¡Verificar cuenta!</a>
                </div>
            </div>
        `,
    });
};

module.exports = { index, create, show, destroy, update };

