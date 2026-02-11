# GiveWiZe Supabase Email Templates

Copy each HTML block below into the corresponding template field in the Supabase Dashboard under **Authentication > Email Templates**.

---

## 1. Confirm Signup

**Supabase location:** Authentication > Email Templates > **Confirm signup**
**Subject line:** Confirm your GiveWiZe account

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#111827;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#111827;">
  <tr><td align="center" style="padding:40px 20px;">
    <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%;background-color:#1a1f3a;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
      <!-- Header -->
      <tr><td align="center" style="padding:36px 40px 24px 40px;">
        <div style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Give<span style="color:#3B82F6;">Wi</span><span style="color:#F97316;">Z</span>e</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:4px;letter-spacing:0.5px;">AI-Powered Charity Discovery</div>
      </td></tr>
      <!-- Divider -->
      <tr><td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);"></div></td></tr>
      <!-- Body -->
      <tr><td style="padding:32px 40px;">
        <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:700;color:#ffffff;">Welcome to GiveWiZe!</h1>
        <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.7);">Thanks for signing up. Please confirm your email address to activate your account and start discovering charities that match your values.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr><td align="center" style="padding:8px 0 8px 0;">
            <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#F97316,#ea580c);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;letter-spacing:0.3px;">Confirm My Email</a>
          </td></tr>
        </table>
        <p style="margin:24px 0 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.4);">If you didn't create a GiveWiZe account, you can safely ignore this email.</p>
      </td></tr>
      <!-- Footer -->
      <tr><td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);"></div></td></tr>
      <tr><td align="center" style="padding:24px 40px 32px 40px;">
        <a href="https://givewize.org" style="font-size:13px;color:#3B82F6;text-decoration:none;">givewize.org</a>
        <p style="margin:8px 0 0 0;font-size:12px;color:rgba(255,255,255,0.3);">&copy; 2026 GiveWiZe. All rights reserved.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
```

---

## 2. Password Reset / Recovery

**Supabase location:** Authentication > Email Templates > **Reset password**
**Subject line:** Reset your GiveWiZe password

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#111827;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#111827;">
  <tr><td align="center" style="padding:40px 20px;">
    <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%;background-color:#1a1f3a;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
      <!-- Header -->
      <tr><td align="center" style="padding:36px 40px 24px 40px;">
        <div style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Give<span style="color:#3B82F6;">Wi</span><span style="color:#F97316;">Z</span>e</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:4px;letter-spacing:0.5px;">AI-Powered Charity Discovery</div>
      </td></tr>
      <!-- Divider -->
      <tr><td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);"></div></td></tr>
      <!-- Body -->
      <tr><td style="padding:32px 40px;">
        <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:700;color:#ffffff;">Reset Your Password</h1>
        <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.7);">We received a request to reset the password for your GiveWiZe account. Click the button below to choose a new password.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr><td align="center" style="padding:8px 0 8px 0;">
            <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#F97316,#ea580c);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;letter-spacing:0.3px;">Reset Password</a>
          </td></tr>
        </table>
        <p style="margin:24px 0 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.4);">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
      </td></tr>
      <!-- Footer -->
      <tr><td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);"></div></td></tr>
      <tr><td align="center" style="padding:24px 40px 32px 40px;">
        <a href="https://givewize.org" style="font-size:13px;color:#3B82F6;text-decoration:none;">givewize.org</a>
        <p style="margin:8px 0 0 0;font-size:12px;color:rgba(255,255,255,0.3);">&copy; 2026 GiveWiZe. All rights reserved.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
```

---

## 3. Magic Link

**Supabase location:** Authentication > Email Templates > **Magic link**
**Subject line:** Your GiveWiZe sign-in link

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#111827;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#111827;">
  <tr><td align="center" style="padding:40px 20px;">
    <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%;background-color:#1a1f3a;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
      <!-- Header -->
      <tr><td align="center" style="padding:36px 40px 24px 40px;">
        <div style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Give<span style="color:#3B82F6;">Wi</span><span style="color:#F97316;">Z</span>e</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:4px;letter-spacing:0.5px;">AI-Powered Charity Discovery</div>
      </td></tr>
      <!-- Divider -->
      <tr><td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);"></div></td></tr>
      <!-- Body -->
      <tr><td style="padding:32px 40px;">
        <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:700;color:#ffffff;">Sign In to GiveWiZe</h1>
        <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.7);">Click the button below to securely sign in to your GiveWiZe account. No password needed.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr><td align="center" style="padding:8px 0 8px 0;">
            <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#F97316,#ea580c);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;letter-spacing:0.3px;">Sign In to GiveWiZe</a>
          </td></tr>
        </table>
        <p style="margin:24px 0 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.4);">This link will expire shortly. If you didn't request this sign-in link, you can safely ignore this email.</p>
      </td></tr>
      <!-- Footer -->
      <tr><td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);"></div></td></tr>
      <tr><td align="center" style="padding:24px 40px 32px 40px;">
        <a href="https://givewize.org" style="font-size:13px;color:#3B82F6;text-decoration:none;">givewize.org</a>
        <p style="margin:8px 0 0 0;font-size:12px;color:rgba(255,255,255,0.3);">&copy; 2026 GiveWiZe. All rights reserved.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
```

---

## 4. Email Change Confirmation

**Supabase location:** Authentication > Email Templates > **Change email address**
**Subject line:** Confirm your new GiveWiZe email address

```html
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#111827;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#111827;">
  <tr><td align="center" style="padding:40px 20px;">
    <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;width:100%;background-color:#1a1f3a;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
      <!-- Header -->
      <tr><td align="center" style="padding:36px 40px 24px 40px;">
        <div style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">Give<span style="color:#3B82F6;">Wi</span><span style="color:#F97316;">Z</span>e</div>
        <div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:4px;letter-spacing:0.5px;">AI-Powered Charity Discovery</div>
      </td></tr>
      <!-- Divider -->
      <tr><td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);"></div></td></tr>
      <!-- Body -->
      <tr><td style="padding:32px 40px;">
        <h1 style="margin:0 0 16px 0;font-size:22px;font-weight:700;color:#ffffff;">Confirm Email Change</h1>
        <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.7);">You requested to change the email address on your GiveWiZe account. Click the button below to confirm this change.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr><td align="center" style="padding:8px 0 8px 0;">
            <a href="{{ .ConfirmationURL }}" target="_blank" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#F97316,#ea580c);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;letter-spacing:0.3px;">Confirm New Email</a>
          </td></tr>
        </table>
        <p style="margin:24px 0 0 0;font-size:13px;line-height:1.5;color:rgba(255,255,255,0.4);">If you didn't request this change, please secure your account by resetting your password immediately.</p>
      </td></tr>
      <!-- Footer -->
      <tr><td style="padding:0 40px;"><div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);"></div></td></tr>
      <tr><td align="center" style="padding:24px 40px 32px 40px;">
        <a href="https://givewize.org" style="font-size:13px;color:#3B82F6;text-decoration:none;">givewize.org</a>
        <p style="margin:8px 0 0 0;font-size:12px;color:rgba(255,255,255,0.3);">&copy; 2026 GiveWiZe. All rights reserved.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>
```

---

## How to Apply

1. Go to your Supabase Dashboard at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your GiveWiZe project
3. Navigate to **Authentication** > **Email Templates**
4. For each template tab, paste the corresponding HTML above
5. Set the **Subject** line as noted above each template
6. Click **Save**
