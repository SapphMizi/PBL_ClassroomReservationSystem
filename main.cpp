#include "common.h"
#include <iostream>

// g++ -o main main.cpp global_vars.cpp && g++ -o student_program student_program.cpp global_vars.cpp && g++ -o admin_program admin_program.cpp global_vars.cpp
// ./main

int main() {
    cout << "------------ログイン------------" << endl;
    while (true) {
        cout << "学生の方は1を，教務の方は2を入力してください：";
        int attribute;
        cin >> attribute;

        if (attribute == 1) {
            for (int i = 0; i < clubs.size(); i++) {
                cout << i + 1 << "：" << clubs[i].name;
                if (i == clubs.size() - 1) {
                    cout << endl;
                }
                else {
                    cout << "，";
                }
            }
            int club_num;
            while (true) {
                cout << "部活を選択してください：";
                cin >> club_num;
                if (club_num > clubs.size()) {
                    cout << "その部活動は存在しません．" << endl;
                }
                else break;
            }
            string password;
            while (true) {
                cout << "パスワードを入力してください：";
                cin >> password;
                if (password == clubs[club_num - 1].password) {
                    userState.setStudent(clubs[club_num - 1].name);
                    cout << "ログイン成功" << endl;
                    cout << "あなたは" << userState.getClubName() << "ですね．" << endl;
                    
                    // 学生用プログラムを実行
                    string command = "./student_program " + userState.getClubName();
                    system(command.c_str());
                    break;
                }
                else {
                    cout << "パスワードが間違っています．" << endl;
                }
            }
        }
        else if (attribute == 2) {
            string password;
            while (true) {
                cout << "パスワードを入力してください：";
                cin >> password;
                if (password == schoolaffair.password) {
                    userState.setAdmin();
                    cout << "ログイン成功" << endl;
                    cout << "あなたは教務ですね．" << endl;
                    
                    // 教務用プログラムを実行
                    system("./admin_program");
                    break;
                }
                else {
                    cout << "パスワードが間違っています．" << endl;
                }
            }
        }
        else {
            cout << "入力が間違っています．" << endl;
        }
    }
    return 0;
}