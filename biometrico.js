//Constantes rutas de listas
const rutaIpEstaticas = '/etc/squid3/ip/ipestaticas';
const rutaIpLibres = '/etc/squid3/ip/iprapidas';

//Libreria ZKTeco
const ZKLib = require('./zklib')

//Modulo fs y modulo readline
const fs     = require('fs'),
    readline = require('readline');

//Se importa el comando 'exec' del modulo child_process
const { exec } = require('child_process');

const usuarios = [];
const ips = [];
/*const data = {
    userId: '28149131',
    time: '10101010'
}*/

const readLine = (usuarios, ips, biometrico) => {

    //leer IP estaticas
    const leerEstaticas = readline.createInterface({
        input: fs.createReadStream(rutaIpEstaticas)
    });

    //leer IP libres
    const leerLibres = readline.createInterface({
        input: fs.createReadStream(rutaIpLibres)
    });

    leerEstaticas.on("line", linea =>{
        let datos = linea.split('|');
        let usuario = {
            id: datos[0],
            ip: datos[1],
            nombre: datos[2]
        }

        usuarios.push(usuario);
    }).on("close", () =>{
        usuarios.forEach(usuario => {
            if(usuario.id == biometrico){  
                leerLibres.on("line", linea => ips.push(linea)
                ).on("close", () =>{
                    if(!ips.includes(usuario.ip)){
                        fs.appendFile(rutaIpLibres, usuario.ip, (err) =>{
                            if (err) throw err;
                            console.log('IP agregada');  
                            exec('service squid3 restart', (error, stdout, stderr) => {
                                if (error) {
                                  console.error(`error: ${error.message}`);
                                  return;
                                }
                              
                                if (stderr) {
                                  console.error(`stderr: ${stderr}`);
                                  return;
                                }
                              
                                console.log(`stdout:\n${stdout}`);
                            });      
                        })
                    }else{
                        console.log("IP en PROXY")
                    }
                })
            }else{
                console.log('Usuario no valido');
            }
        });
    });    
}

const app = async () => {

    let zkInstance = new ZKLib('10.0.5.18', 4370, 10000, 4000);
    try {
        // Create socket to machine 
        await zkInstance.createSocket()

    } catch (e) {

    }

   await zkInstance.getRealTimeLogs((data) => {
        // do something when some checkin
        console.log(data);
        readLine(usuarios, ips, data.userId);
    })
}

//readLine(usuarios, ips, data.userId);
app();