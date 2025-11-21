import { Resend } from "resend";
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Gera um código aleatório de 6 dígitos
export const generateSixDigitCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Envia um email com o código de 2FA
export const sendTwoFactorCode = async (email, code) => {
  try {
    const result = await resend.emails.send({
      from: "Khora <onboarding@resend.dev>",
      to: email,
      subject: "Seu código de autenticação de dois fatores - Khora",
      html: `
           <div style="margin:0; padding:0; background:#F5F5F5; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F5; padding:40px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF; border-radius:14px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">

          <tr>
            <td style="
              background:linear-gradient(135deg, #1E3A8A, #0D2B7A) !important;
              padding:30px;
              text-align:center;
              color:#FFFFFF !important;
            ">
              <h1 style="margin:0; font-size:24px; font-weight:600; color:#FFFFFF !important;">Khora</h1>
              <p style="margin:8px 0 0; font-size:14px; opacity:0.9; color:#FFFFFF !important;">
                Tecnologia e cuidado integrado
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:30px; color:#373737; font-size:16px; line-height:1.6;">

              <h2 style="margin-top:0; font-size:22px; color:#1E3A8A;">Autenticação de Dois Fatores</h2>

              <p>Olá,</p>

              <p>Você solicitou um código para completar o login. Aqui está seu código de verificação:</p>

              <div style="
                background:rgba(59, 130, 246, 0.1);
                padding:25px;
                text-align:center;
                margin:25px 0;
                border-radius:10px;
                border:1px solid rgba(59, 130, 246, 0.2);
              ">
                <h1 style="
                  margin:0;
                  font-size:36px;
                  letter-spacing:12px;
                  color:#0D2B7A;
                  font-weight:700;
                  text-transform:uppercase;
                ">
                  ${code}
                </h1>
              </div>

              <p style="font-size:15px; color:#5A5A5A;">
                Este código expira em <strong>3 minutos</strong>.
              </p>

              <p style="margin-top:20px; font-size:15px; color:#373737;">
                <strong>Se você não solicitou este código, apenas ignore este email.</strong>
              </p>

              <p style="margin-top:30px;">
                Atenciosamente,<br>
                <strong>Equipe Khora</strong>
              </p>

            </td>
          </tr>

          <tr>
            <td style="background:#E0E0E0; padding:20px; text-align:center; font-size:12px; color:#5A5A5A;">
              © 2025 Khora — Saúde masculina moderna<br/>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</div>

            `,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Erro ao enviar email de 2FA:", error);
    throw new Error("Falha ao enviar código de autenticação");
  }
};

export const sendResetPasswordCode = async (email, code) => {
  try {
    const result = await resend.emails.send({
      from: "Khora <onboarding@resend.dev>",
      to: email,
      subject: "Seu código de verificação de email - Khora",
      html: `
           <div style="margin:0; padding:0; background:#F5F5F5; font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F5; padding:40px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF; border-radius:14px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">

          <tr>
            <td style="
              background:linear-gradient(135deg, #1E3A8A, #0D2B7A) !important;
              padding:30px;
              text-align:center;
              color:#FFFFFF !important;
            ">
              <h1 style="margin:0; font-size:24px; font-weight:600; color:#FFFFFF !important;">Khora</h1>
              <p style="margin:8px 0 0; font-size:14px; opacity:0.9; color:#FFFFFF !important;">
                Tecnologia e cuidado integrado
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:30px; color:#373737; font-size:16px; line-height:1.6;">

              <h2 style="margin-top:0; font-size:22px; color:#1E3A8A;">Validação de email</h2>

              <p>Olá,</p>

              <p>Recebemos uma solicitação para redefinir a senha da sua conta no app Khora.</p>

              <p>Copie o código abaixo</p>

              <div style="
                background:rgba(59, 130, 246, 0.1);
                padding:25px;
                text-align:center;
                margin:25px 0;
                border-radius:10px;
                border:1px solid rgba(59, 130, 246, 0.2);
              ">
                <h1 style="
                  margin:0;
                  font-size:36px;
                  letter-spacing:12px;
                  color:#0D2B7A;
                  font-weight:700;
                  text-transform:uppercase;
                ">
                  ${code}
                </h1>
              </div>

              <p style="font-size:15px; color:#5A5A5A;">
                Este código expira em <strong>3 minutos</strong>.
              </p>

              <p style="margin-top:20px; font-size:15px; color:#373737;">
                <strong>Se você não solicitou este código, apenas ignore este email.</strong>
              </p>

              <p style="margin-top:30px;">
                Atenciosamente,<br>
                <strong>Equipe Khora</strong>
              </p>

            </td>
          </tr>

          <tr>
            <td style="background:#E0E0E0; padding:20px; text-align:center; font-size:12px; color:#5A5A5A;">
              © 2025 Khora — Saúde masculina moderna<br/>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</div>

            `,
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Erro ao enviar email de 2FA:", error);
    throw new Error("Falha ao enviar código de autenticação");
  }
};

// Cria e armazena um código de 2FA
export const createTwoFactorCode = async (userId) => {
  try {
    const code = generateSixDigitCode();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // Expira em 3 minutos


    const twoFactorCode = await prisma.two_factor_code.create({
      data: {
        user_id: userId,
        code: code,
        expiresAt: expiresAt,
      },
    });


    return { code, expiresAt, id: twoFactorCode.id };
  } catch (error) {
    console.error("Erro ao criar código de 2FA:", error);
    throw new Error("Falha ao gerar código de autenticação");
  }
};

// Valida o código de 2FA
export const validateTwoFactorCode = async (userId, code) => {
  try {
    const twoFactorCode = await prisma.two_factor_code.findFirst({
      where: {
        user_id: userId,
        code: code,
        isUsed: false,
      },
    });

    if (!twoFactorCode) {
      return { valid: false, message: "Código inválido ou expirado" };
    }

    if (new Date() > twoFactorCode.expiresAt) {
      return { valid: false, message: "Código expirado" };
    }

    await prisma.two_factor_code.update({
      where: { id: twoFactorCode.id },
      data: { isUsed: true },
    });

    return { valid: true };
  } catch (error) {
    console.error("Erro ao validar código de 2FA:", error);
    throw new Error("Falha ao validar código de autenticação");
  }
};

// Limpa códigos expirados
export const cleanExpiredCodes = async () => {
  try {
    await prisma.two_factor_code.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  } catch (error) {
    console.error("Erro ao limpar códigos expirados:", error);
  }
};
