import chromedriver_autoinstaller
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException,StaleElementReferenceException, SessionNotCreatedException 
import json
import time
import sys
import platform
from shutil import move
import os

def Report(R):
    print(R, end = "", flush = True)


def Replacer(sentence): #remvoes the \n from the text and replaces the word electronic with -1 and &nbsp;
    return sentence.replace("Electronic", "-1").replace("\n", "").replace("&nbsp;", " ")


class Scrapper:
    def __init__(self):
        self.SemesterLabels = []
        self.SemestersData = []
        self.JsonDataContainer = []
        self.token = "0"
        self.json = None
        self.LinkAndCheckDriverCompatibility()
       

    def LinkAndCheckDriverCompatibility(self):
        options = Options()
        options.add_argument("--remote-debugging-port=9230")
        # options.add_argument("--headless")
        self.driver = None
        # while self.driver is None:
        try:
            chrome_service = None
            if platform.system() == "Windows":
                self.platform = 1
                chrome_service = Service("..\..\Attachments\chromedriver.exe")#moved to windows this  is needed to work
            else:
                self.platform = 0
                chrome_service = Service("../../Attachments/chromedriver")
            self.driver = webdriver.Chrome(service=chrome_service, options=options)
        except SessionNotCreatedException:
            print("bad version")
            self.WebdriverUpdater()
        try:
            self.driver.get("https://portal.aaup.edu/faces/ui/login.xhtml")
        except:
            Report("|-|")
            self.driver.quit()
            sys.exit()

    def WebdriverUpdater(self):
        chromedriver_autoinstaller.install(path="../../Attachments")
        for it in os.scandir("../../Attachments"):
            if it.is_dir():
                downloadedFilePath = os.path.abspath(os.path.join(it.path, os.listdir(it.path)[0]))
                fname = "chromedriver.exe" if self.platform else "chromedriver"
                if os.path.exists(f"../../Attachments/{fname}"):
                    os.remove(f"../../Attachments/{fname}")
                move(downloadedFilePath, "../../Attachments")
                os.rmdir(it.path)
        

    def LimitSpeed(self): #limiting the network speed for testing purposes
        self.driver.set_network_conditions(
        offline=False,
        latency=5,  # additional latency (ms)
        download_throughput=100 * 1024,  # maximal throughput
        upload_throughput=100 * 1024)  # maximal throughput
        


    def Login(self, username, password):
        #getting the 2 inputs container, this way i won't have an error if they changed the id
        UserAndPassContainer = self.driver.find_elements(By.CLASS_NAME, "md-inputfield")
        UsernameBar = UserAndPassContainer[0].find_element(By.TAG_NAME,"input") #getting user's bar
        PasswordBar = UserAndPassContainer[1].find_element(By.TAG_NAME,"input") #getting password's bar
        UsernameBar.send_keys(username) #sending the name
        PasswordBar.send_keys(password) #sending the pass
        self.driver.find_element(By.XPATH, "/html/body/div[1]/form/div/div/div[5]/button/span[2]").click() #logging in
        try: #catches an error which triggered due error in connection
            WebDriverWait(self.driver, 1).until(EC.visibility_of_element_located((By.CLASS_NAME, "ui-growl-item")))
            Report("|-|")
            self.driver.quit()
            sys.exit()
        except TimeoutException:
            pass


    def GetToken(self): #getting the user's token
        #getting the url which has the token in it at the end vvvvv
        try:
            xpath = "/html/body/div[1]/div[2]/div/div/div[1]/div[2]/div/div[1]/form/ul/li[5]/ul/li[1]"
            href = WebDriverWait(self.driver, 1).until(EC.presence_of_element_located((By.XPATH, xpath))).find_element(By.TAG_NAME,"a").get_attribute("href")
            self.token = href.partition("Token=")[2] #extracting the token from that url
        except TimeoutException:
            Report("|-|")
            self.driver.quit()
            sys.exit()
    

    def NavigateToScheduale(self): #navigating to the schedual site
        #this is the default url which directs you to your schedual vvvvvv
        try:
            url = "https://portal.aaup.edu/faces/ui/pages/student/schedule/index.xhtml?javax.faces.Token="
            self.driver.get(url + self.token) # adding the token and getting to the site
        except:
            Report("|-|")
            self.driver.quit()
            sys.exit()


    def GetSemestersLabels(self): #Getting all related schedual info
        #geting the options
        try:
            SemestersLi = WebDriverWait(self.driver, 3).until(EC.presence_of_element_located((By.XPATH, '//*[@id="contents:semesters_items"]'))).find_elements(By.TAG_NAME, "li")
            for li in SemestersLi[1:]: #loops in the options + excluding the first useless option
                self.SemesterLabels.append(li.get_attribute("innerHTML"))
        except TimeoutException:
            Report("|-|")
            self.driver.quit()
            sys.exit()


    def GetInfoFromSemesterTable(self):
        try:
            for i in range(1, len(self.SemesterLabels) + 1): #ignores the "please select"(starts counting from 1 not from 0) option but this gonna cause ignoring 1 semester so you add 1
                ScheduleRows = [] # stores all the rows of the schedule
                #gets the schedual's labels buttons VVVVVVV
                SemesterBtn = WebDriverWait(self.driver, 3).until(EC.presence_of_element_located((By.CSS_SELECTOR, "#contents\:semesters_items"))).find_elements(By.TAG_NAME, "li")[i]
                self.driver.execute_script("arguments[0].click()", SemesterBtn)# clicks on the button, used this way cuz the elements are invisible
                #waits until the schedual loads VVVV                           #if i didn't use this method i should have click on the menu to make them show then click on the label
                WebDriverWait(self.driver, 3).until(EC.invisibility_of_element_located((By.CLASS_NAME, "j_idt323_modal")))
                time.sleep(1) #sleeps to let the rows load 100%
                #extracts the rows of data
                SemesterDataRows = WebDriverWait(self.driver, 3).until(EC.presence_of_element_located((By.XPATH, "/html/body/div[1]/form/div/div/div[2]/div/div/div[1]/div[2]/table/tbody"))).find_elements(By.TAG_NAME, "tr")
                for PieceOfData in SemesterDataRows: #loops through these rows
                    DataRow = []
                    for RawDataContainer in PieceOfData.find_elements(By.TAG_NAME,"td")[:-2]:#loops through these pieces of data but ignores the last 2
                        #extracts the raw data from the label and removes the \n from it VVVVV
                        RawData = RawDataContainer.find_elements(By.CLASS_NAME, "ui-widget")[0].get_attribute("innerHTML")
                        RawData = Replacer(RawData)
                        DataRow.append(RawData) #appends it to the current row
                    DataRow[0],DataRow[1] = DataRow[1],DataRow[0] #swaps first element with the second one
                    ScheduleRows.append(DataRow) #appends all the raw data to array
                self.SemestersData.append(ScheduleRows) 
        except StaleElementReferenceException:
            Report("|-|")
            self.driver.quit()
            sys.exit()

        
    def JsonMaker(self):
        try:
            self.jsonDataContainer = {self.SemesterLabels[i]: self.SemestersData[i] for i in range (len(self.SemestersData))}
            self.json = json.dumps(self.jsonDataContainer, ensure_ascii = False)
            with open("../Data.json",'w',encoding = 'utf-8') as f:
                f.write(self.json)
        except:
            Report("|-|")
            self.driver.quit()
            sys.exit()


def extract_version(output):
    try:
        google_version = ''
        for letter in output[output.rindex('DisplayVersion    REG_SZ') + 24:]:
            if letter != '\n':
                google_version += letter
            else:
                break
        return(google_version.strip())
    except TypeError:
        return


if __name__=='__main__':
    #the next "reports" get's written to file when running the script on background
    #these logs gonnab be useful when errors occure, and getting info to the site abotu current situation
    Report("$Connecting")
    scrapper = Scrapper()
    Report("|+|")
    Report("$Logging in")
    scrapper.Login(sys.argv[1] , sys.argv[2])
    Report("|+|")
    Report("$Finding the token")
    scrapper.GetToken()
    Report("|+|") #Token has been obtained!
    Report("$Navigating to schedules page")
    scrapper.NavigateToScheduale()
    Report("|+|") #Navigated into Scheduals
    Report("$Finding the semesters")
    scrapper.GetSemestersLabels()
    Report("|+|") #Got the semesters of your Scheduals
    Report("$Collecting the data")
    scrapper.GetInfoFromSemesterTable()
    Report("|+|") #Got the data of each one of your scheduals
    scrapper.JsonMaker()
    Report("DONE")   
    scrapper.driver.quit()
