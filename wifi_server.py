import socket
from gpiozero import CPUTemperature
import picar_4wd as fc

HOST = "192.168.1.72" # IP address of your Raspberry PI
PORT = 65432          # Port to listen on (non-privileged ports are > 1023)


def power_read():
    from picar_4wd.adc import ADC
    power_read_pin = ADC('A4')
    power_val = power_read_pin.read()
    power_val = power_val / 4095.0 * 3.3
    # print(power_val)
    power_val = power_val * 3
    power_val = round(power_val, 2)
    return power_val

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()
    try:
        while 1:
            client, clientInfo = s.accept()
            print("server recv from: ", clientInfo)
            data = client.recv(1024)      # receive 1024 Bytes of message in binary format
            if data == b"84\r\n":
            	cpuTemp = CPUTemperature()
            	cpuTemp = str(cpuTemp.temperature)
            	cpuTemp_byte = bytes(cpuTemp, 'utf-8')
            	print('Temp: {}'.format(str(cpuTemp)))
            	client.sendall(cpuTemp_byte)
            elif data == b"38\r\n":
                print('Moving Car Forward')
                fc.forward(60)
                client.sendall(b"Forward\r\n") # Echo back to client
            elif data == b"40\r\n":
                print('Moving Car Backward')
                fc.backward(60)
                client.sendall(b"Backward\r\n")
            elif data == b"37\r\n":
                print('Turning Car Left')
                fc.turn_left(60)
                client.sendall(b"Left\r\n")
            elif data == b"39\r\n":
                print('Turning Car Right')
                fc.turn_right(60)
                client.sendall(b"Right\r\n")
            elif data == b"83\r\n":
                print('Power: {}'.format(str(power_read())))
                power = str(power_read())
                power_byte = bytes(power, 'utf-8')
                client.sendall(power_byte)
            else:
                print('Listening')
                fc.stop()
                pass
    except:
        print("Closing socket")
        client.close()
        s.close()
