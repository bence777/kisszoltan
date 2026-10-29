import {randomBytes,scryptSync} from 'node:crypto';
const password=process.argv[2];
if(!password||password.length<20){console.error('Usage: node scripts/generate-admin-password.mjs "legalabb-20-karakteres-eros-jelszo"');process.exit(1);}
const salt=randomBytes(16);console.log(`${salt.toString('hex')}:${scryptSync(password,salt,64).toString('hex')}`);
