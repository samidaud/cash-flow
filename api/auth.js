export default async function handler(req, res) {
    const AZURE_CONFIG = {
        clientId: '0c0385dd-8b7e-4a9d-ad89-403082b8f8ce',
        tenantId: '2ae6a277-f72a-4953-a345-df52166894f2',
        clientSecret: 'QBm8Q-VqAM2nqw62vfi1sQ350Wug53hxxpNzycyV',
        redirectUri: 'https://cash-flow-sigma-teal.vercel.app/api/auth'
    };

    if (req.method === 'GET') {
        const { code } = req.query;
        
        if (!code) {
            const authUrl = `https://login.microsoftonline.com/${AZURE_CONFIG.tenantId}/oauth2/v2.0/authorize?client_id=${AZURE_CONFIG.clientId}&redirect_uri=${encodeURIComponent(AZURE_CONFIG.redirectUri)}&response_type=code&scope=${encodeURIComponent('https://graph.microsoft.com/.default')}&state=random_state`;
            return res.redirect(authUrl);
        }
        
        try {
            const tokenResponse = await fetch(`https://login.microsoftonline.com/${AZURE_CONFIG.tenantId}/oauth2/v2.0/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: AZURE_CONFIG.clientId,
                    client_secret: AZURE_CONFIG.clientSecret,
                    code: code,
                    redirect_uri: AZURE_CONFIG.redirectUri,
                    grant_type: 'authorization_code',
                    scope: 'https://graph.microsoft.com/.default'
                }).toString()
            });
            
            const tokenData = await tokenResponse.json();
            if (tokenData.access_token) {
                return res.redirect(`/?token=${encodeURIComponent(tokenData.access_token)}`);
            }
            return res.status(400).json({ error: 'Failed' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    res.status(405).json({ error: 'Not allowed' });
}
