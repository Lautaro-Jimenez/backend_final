import { PasswordRecoveryService, UserService } from "../repository/index.repository.js";
import { passwordRecoveryEmail } from "../config/mailing.config.js";
import AppException from "../utils/customErrors/AppException.js";
import { isValidPass, hashPassword } from "../utils/sessionUtils.js";

class PasswordRecoveryValidator {
    async generateLink(req) {
        const email = req.body.email;

        if (!email) {
            throw new AppException('REQUIRED FIELD', 'Email is required', 400)
        };

        const user = await UserService.findByEmail(email);
        if (!user) {
            throw new AppException('NOT FOUND', 'User does not exist', 404)
        }

        const request = await PasswordRecoveryService.createLink({ user: email });

        const website = req.protocol + '://' + req.get('host');
        const sendEmail = passwordRecoveryEmail(email, website, request.id)

        return { message: 'Email sent!' }
    }

    async linkValidation(id) {
        const request = await PasswordRecoveryService.findPasswordRequest(id);

        return request;
    }

    async validatePassword(data) {
        console.log(data)
        const { email, password } = data;

        const user = await UserService.findByEmail(email);

        if (isValidPass(user, password)) {
            throw new AppException('PASSWORD', 'Password is already in use by the user', 400)
        };


        const update = await UserService.newPassword(user.id, { password: hashPassword(password) })

        return { message: 'Password change successful!' }
    }
}

export default new PasswordRecoveryValidator();