"""

Project:

Create a PC Part Picker clone in python, but for mechanical keyboards

Component selections:

1. Chassis
2. Switches
3. Lubrication
"""


class ChassisOption:
    # options:
    # PCB face: North, South
    # Number of keys
    # text description has this separated by commas:
    # Brand Name, Full Name, Number of Keys, Keyboard layout name, Switches included(true/false), price,
    def __init__(self, text_description) :
        self.txt = text_description
        l = self.txt.split(',')
        self.brandname = l[0]
        self.fullname = l[1]
        self.numberofkeys = int(l[2],10)
        self.keyboardlayout = l[3]
        self.switchesIncluded = l[4]
        self.price = float(l[5])
    
chassis_options = [
    ChassisOption('Monsgeek,M5,108,Full Size,false,129.99'),
    ChassisOption('Monsgeek,M3,87,TKL,false,109.99'),
    ChassisOption('Monsgeek,M2,98,1800 compact,false,109.99'),
    ChassisOption('idobao,IDOBAO ID80 V2 MX Mechanical Keyboard Barebone Kit,84,75%,false, 179.00')
]



chassisInputPrompt = """
Choose a chassis option. You have these options:
    1. Monsgeek M5 (108 key chassis)
    2. Monsgeek M3 (87 key chassis) 
    3. Monsgeek M2 (98 key chassis)
    4. idobao ID80 v2 (84 key chassis)
Make your selection!
"""


chassis = input(chassisInputPrompt)
chassis_number = int(chassis, 10)
# print('You chose ' + str(chassis_number))
chassis_selection = chassis_options[chassis_number-1]
print('Brand name: ' + chassis_selection.brandname)
print('Full name: ' + chassis_selection.fullname)
print('Number of Keys: ' + str(chassis_selection.numberofkeys))
print('Keyboard layout: ' + chassis_selection.keyboardlayout)
print('Switches Included?: ' + chassis_selection.switchesIncluded)
print('Price: ' + str(chassis_selection.price))


class SwitchOption: 
    # text description:
    # has to have these things in order:
    # Brand name, full name, switch stem color, switch style, switch body color, switch pin layout, pre-lubed (true/false), RGB See-through (true/false), quantity, price
    def __init__(self, text_description):
        self.txt = text_description
        l = self.txt.split(',')
        self.brandname = l[0]
        self.fullname = l[1]
        self.stemcolor = l[2]
        self.style = l[3]
        self.bodycolor = l[4]
        self.pinlayout = l[5]
        self.prelubed = l[6]
        self.rgb = l[7]
        self.quantity = int(l[8], 10)
        self.price = float(l[9])
        self.priceperswitch = round(self.price / self.quantity,2)

        #print("initialized switch")

switch_options = [
    SwitchOption('Cherry,Cherry Brown RGB Mechanical Switches,brown,tactile,white,3-pin,true,true,35,22.00'),
    SwitchOption('Cherry,Cherry Red RGB Mechanical Switches,red,tactile,white,3-pin,true,true,35,22.00'),
    SwitchOption('Cherry,Cherry Blue RGB Mechanical Switches,blue,tactile,white,3-pin,true,true,35,22.00')
]

switchInputPrompt = """
Based on your chassis input, you have these options for switches:
1. Cherry MX Brown switches
2. Cherry MX Red switches
3. Cherry MX Blue switches
Make your selection!
"""

switch = input(switchInputPrompt)
switch_number = int(switch, 10)
# print('You chose: ' + str(switch_number))
switch_selection = switch_options[switch_number - 1]
print('Brand Name: ' + switch_selection.brandname)
print('Full Name: ' + switch_selection.fullname)
print('Stem Color: ' + switch_selection.stemcolor)
print('Switch Style: ' + switch_selection.style)
print('Body Color: ' + switch_selection.bodycolor)
print('Pin Layout: ' + switch_selection.pinlayout)
print('Pre-lubed: ' + switch_selection.prelubed)
print('RGB See through: ' + switch_selection.rgb)
print('Quantity: ' + str(switch_selection.quantity))
print('Price: ' + str(switch_selection.price))
print('Price Per Switch: ' + str(switch_selection.priceperswitch))
