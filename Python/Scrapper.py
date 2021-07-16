from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import sys

class Scrapper:
    def __init__(self):
        # self.username = username
        # self.password = password
        self.SemesterLabels = []
        self.token = "0"
        self.driver = webdriver.Chrome()
        self.driver.get("https://portal.aaup.edu/faces/ui/login.xhtml")

    def Login(self, username, password):
        UsernameBar = self.driver.find_element_by_id("lognForm:j_idt17") #getting user's bar
        PasswordBar = self.driver.find_element_by_id("lognForm:j_idt21") #getting password's bar
        UsernameBar.send_keys(username) #sending the name
        PasswordBar.send_keys(password) #sending the pass
        self.driver.find_element_by_xpath("/html/body/div[1]/form/div/div/div[5]/button/span[2]").click() #logging in

    def GetToken(self): #getting the user's token
        #getting the url which has the token in it at the end vvvvv
        href = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, "menu-form:j_idt69"))).find_element_by_tag_name("a").get_attribute("href")
        self.token = href.partition("Token=")[2] #extracting the token from that url
    
    def NavigateToScheduale(self): #navigating to the schedual site
        #this is the default url which directs you to your schedual vvvvvv
        url = "https://portal.aaup.edu/faces/ui/pages/student/schedule/index.xhtml?javax.faces.Token="
        self.driver.get(url + self.token) # adding the token and getting to the site

    def GetSemestersLabels(self): #Getting all related schedual info
        #geting the options 
        SemestersLi = WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.XPATH, '//*[@id="contents:semesters_items"]'))).find_elements_by_tag_name("li")
        for li in SemestersLi[1:]: #loops in the options + excluding the first useless option
            self.SemesterLabels.append(li.get_attribute("innerHTML"))
        print(self.SemesterLabels)

    def GetInfoFromSemesterTable():
        pass
        
    
    def __del__(self): # runs when object gets deleted and closes the driver
        self.driver.close()


if __name__=='__main__':
    '''
    # scrapper = Scrapper(sys.argv[1] , sys.argv[2]) i get the name and the password here but
                                            i commented it cuz im still working on it, simply saving time
    '''
    scrapper = Scrapper()
    scrapper.Login("****" , "****") #calling the login function
    #btw these prints that you gonna see next are nothing but just to give simple info i will remove them later
    print("[+] You Have Been Loged Successfully")
    scrapper.GetToken()
    print("[+] Token has been obtained!")
    scrapper.NavigateToScheduale()
    print("[+] Navigated into Scheduals")
    scrapper.GetSemestersLabels()
    print("[+] Got the semesters of your Scheduals")
    input("Press Enter to continue...")
    del scrapper