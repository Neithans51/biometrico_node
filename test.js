const ZKLib = require('./zklib')
const test = async () => {


    let zkInstance = new ZKLib('10.0.5.18', 4370, 10000, 4000);
    try {
        // Create socket to machine 
        await zkInstance.createSocket()


        // Get general info like logCapacity, user counts, logs count
        // It's really useful to check the status of device 
        console.log(await zkInstance.getInfo())
    } catch (e) {
    }

    // Disconnect the machine ( don't do this when you need realtime update :))) 
    // const users = await zkInstance.getUsers();
    // console.log(users.data.length);

   await zkInstance.getRealTimeLogs((data)=>{
        // do something when some checkin
        console.log(data.userId)
    })

    //const users = await zkInstance.getUsers();
    //console.log(users.data)

}

test()
