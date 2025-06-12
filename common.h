#ifndef COMMON_H
#define COMMON_H

#include <string>
#include <vector>
#include <map>
using namespace std;

// 部活の情報
struct club {
    string name;
    string password;
};

// 教務の情報
struct schoolAffair {
    string password;
};

// 現在のユーザーの状態
class currentUserState {
private:
    string userType;  // "student" または "admin"
    string clubName;  // 学生の場合は部活名、教務の場合は "Admin"

public:
    currentUserState() {
        userType = "";
        clubName = "";
    }

    void setStudent(string club) {
        userType = "student";
        clubName = club;
    }

    void setAdmin() {
        userType = "admin";
        clubName = "Admin";
    }

    string getUserType() const {
        return userType;
    }

    string getClubName() const {
        return clubName;
    }
};

struct classroom {
    string name;
    int capacity;
    string status; // 固定やセパ
    map<string, string> available_per_day; // 日付ごとの利用可否
};

// グローバル変数の宣言
extern vector<club> clubs;
extern schoolAffair schoolaffair;
extern currentUserState userState;
extern vector<classroom> classrooms;

#endif 