#include "common.h"
#include <iostream>
#include <iomanip>
#include <ctime>
#include <sstream>

// プロトタイプ宣言
void changeClassroomStatus();
void displayClassrooms();
void changeClassroomStatusForTwoWeeks();

void runAdminProgram() {
    cout << "------------教務用プログラム------------" << endl;
    cout << "教務としてログインしています。" << endl;
    cout << "操作を選択してください。" << endl;
    cout << "1. 教室の利用可否を変更する" << endl;
    cout << "2. 教室の一覧を表示する" << endl;
    cout << "3. 終了する" << endl;
    int choice;
    cin >> choice;
    switch (choice) {
        case 1:
            changeClassroomStatus();
            break;
        case 2:
            displayClassrooms();
            break;
        case 3:
            return;
        default:
            cout << "無効な選択です。" << endl;
    }
}

void changeClassroomStatus() {
    cout << "教室の利用可否を変更します。" << endl;
    cout << "教室名を入力してください。" << endl;
    for (auto& classroom : classrooms) {
        cout << classroom.name << " (" << classroom.status << ")" << endl;
    }
    string classroomName;
    cin >> classroomName;
    for (auto& classroom : classrooms) {
        if (classroom.name == classroomName) {
            // ここで日付と利用可否を入力させる処理を追加しても良い
            changeClassroomStatusForTwoWeeks();
            break;
        }
    }
}

void changeClassroomStatusForTwoWeeks() {
    int year, month, day;
    cout << "基準日を入力してください (年 月 日)：";
    cin >> year >> month >> day;

    tm base = {};
    base.tm_year = year - 1900;
    base.tm_mon = month - 1;
    base.tm_mday = day;

    for (int i = 0; i < 14; ++i) {
        time_t t = mktime(&base);
        tm* now = localtime(&t);
        stringstream ss;
        ss << setw(4) << setfill('0') << (now->tm_year + 1900) << "-"
           << setw(2) << setfill('0') << (now->tm_mon + 1) << "-"
           << setw(2) << setfill('0') << now->tm_mday;
        string date_str = ss.str();
        cout << "日付: " << date_str << endl;
        for (auto& c : classrooms) {
            cout << c.name << " (" << c.status << ") の利用可否を入力してください（例: 利用可/不可）: ";
            string available;
            cin >> available;
            c.available_per_day[date_str] = available;
        }
        base.tm_mday += 1;
    }
    cout << "2週間分の利用可否を更新しました。" << endl;
}

void displayClassrooms() {
    cout << "教室一覧を表示します。" << endl;
    for (auto& classroom : classrooms) {
        cout << "教室名: " << classroom.name << endl;
        cout << "利用可否: " << classroom.status << endl;
        cout << "利用可否（日付別）: " << endl;
        for (const auto& pair : classroom.available_per_day) {
            cout << "日付: " << pair.first << ", 利用可否: " << pair.second << endl;
        }
    }
}

int main() {
    while (true) {
        runAdminProgram();
    }
    return 0;
} 