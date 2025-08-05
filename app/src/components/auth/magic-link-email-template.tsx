interface Props {
  magicLink: string;
  expiryTimeText: string;
}

export const MagicLinkEmailTemplate = ({ magicLink, expiryTimeText }: Props) => {
  return (
    <div
      style={{
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        lineHeight: 1.6,
        color: '#333333',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
      }}>
      <table
        width="100%"
        cellPadding={0}
        cellSpacing={0}
        border={0}
        style={{ backgroundColor: '#f7f7f7' }}>
        <tr>
          <td align="center" style={{ padding: '30px 0' }}>
            <img
              src="https://cgaeud8ce2.ufs.sh/f/lzxc7F4aGAuXrFcJG059bOKeGH4cix7qsD2mBJ3PUyZwdIkp"
              alt="Chit-Chat logo"
              style={{
                maxWidth: '100px',
                height: 'auto',
                display: 'block',
              }}
            />
          </td>
        </tr>
        <tr>
          <td
            style={{
              backgroundColor: '#ffffff',
              padding: '40px 30px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            }}>
            <h1
              style={{
                marginTop: '0',
                color: '#2d3748',
                fontSize: '24px',
                fontWeight: '600',
              }}>
              Your sign-in link
            </h1>
            <p style={{ fontSize: '14px', color: '#2d3748' }}>
              Click the button below to sign in to Chit-Chat.
            </p>
            <p style={{ fontSize: '14px', color: '#2d3748' }}>
              This link will expire in {expiryTimeText}.
            </p>
            <a
              href={magicLink}
              target="_blank"
              style={{
                display: 'inline-block',
                margin: '30px 0',
                padding: '8px 32px',
                fontFamily: 'Arial, sans-serif',
                fontSize: '16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: '600',
                borderRadius: '6px',
                backgroundColor: '#7dd3fc',
              }}>
              Sign in
            </a>
            <p style={{ color: '#718096', fontSize: '14px' }}>
              If you didn&apos;t request this link, please ignore this email.
            </p>
            <p style={{ color: '#718096', fontSize: '14px' }}>Or copy this link to your browser:</p>
            <a
              href={magicLink}
              target="_blank"
              style={{
                color: '#4f46e5',
                wordBreak: 'break-all',
                fontSize: '14px',
              }}>
              {magicLink}
            </a>
          </td>
        </tr>
        <tr>
          <td align="center" style={{ padding: '25px 0', color: '#718096', fontSize: '13px' }}>
            <p style={{ margin: '0' }}>
              &copy; {new Date().getFullYear()} Chit-Chat. All rights reserved.
            </p>
            {/* <p style={{ margin: '10px 0 0 0' }}>
                <a href="#" style={{ color: '#4f46e5', textDecoration: 'none' }}>
                  Политика конфиденциальности
                </a>
                &nbsp;&bull;&nbsp;
                <a href="#" style={{ color: '#4f46e5', textDecoration: 'none' }}>
                  Условия использования
                </a>
              </p> */}
          </td>
        </tr>
      </table>
    </div>
  );
};
