import telebot
import config
import json
import time
import mysql.connector

from threading import Thread
from telebot import types

from DB import DB as D

bot = telebot.TeleBot(config.TOKEN)

DB = D(config.mysql)

ID = 5021950435


bot.send_message(ID, "Start Bot")

def json_loads(data):
    try:
        return json.loads(data)
    except:
        return None

def get_students(message):
    data = DB.select('students', ['telegram_id','status_tg','tg'], [['telegram_id', '=', message.chat.id],['tg', '=', message.chat.username]], 1)
    if (data):
        return {"telegram_id": data[0][7], "status_tg": data[0][10], "tg" : data[0][11]}
    else:
        bot.send_message(message.chat.id,"Вы не были зарегистрированы на сайте, попросите учителя зарегистрировать вас https://lengthily-aboveboard-cougar.cloudpub.ru")

def log(message, students):
    query = "INSERT INTO log (text) VALUES (%s)"

def students_update(students, status=None):
    DB.update('students', {'status_tg': status}, [['telegram_id', '=', students['telegram_id']]])

def markups(buttons):
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    b = []
    for i in buttons:
        b.append(types.KeyboardButton(i))
    markup.add(*b)
    return markup

def menu_markups(students):
    answer = markups(["Фото"])
    return answer

@bot.message_handler(commands=['start'])
def start_message(message):
    students = get_students(message)
    if(students["status_tg"] != "menu"):
        bot.send_message(message.chat.id,"Привет, давай соберём твоё портфолио", reply_markup=menu_markups(students))
        log(message, students)
        students_update(students, "menu")

@bot.message_handler(commands=['restart'])
def start_message(message):
    students = get_students(message)
    bot.send_message(message.chat.id,"Ержан, вставай Эй!", reply_markup=menu_markups(students))
    log(message, students)
    students_update(students, "menu")

class MessageHandler:
    
    class Main:
        def to_menu(bot, message, students):
            bot.send_message(students["telegram_id"], "Хорошего дня!", reply_markup=menu_markups(students))
            students_update(students, status="menu")
            return True

    class Photo:
         def photo(bot, message, students, db):
            bot.send_message(students["telegram_id"], "Отправьте фото", reply_markup=menu_markups(students))
            if("ФОТО" in message.text.upper()):
                students_update(students, status='photo') 
                @bot.message_handler(content_types=['photo'])
                def photo_id(message,db):
                    photo = max(message.photo, key=lambda x: x.height)
                    data = DB.select('status', ['status'], [['id', '=', photo.file_id]], 1)
                return True

            

def update_connection():
    while True:
        try:
            del DB
            DB = DB(mysql)
            time.sleep(5)
        except:
            pass

thread1 = Thread(target=update_connection)
thread1.start()

@bot.message_handler(content_types=["text"])
def handle_text(message):
    print(f"{message.chat.id} {message.chat.first_name} |{message.text}|")
    message.text = message.text.strip().replace(" ", " ").replace("\t\t", "\t")
    students = get_students(message)
    log(message, students)

bot.infinity_polling()