#include "common.h"
#include <iostream>

void runStudentProgram(const string& clubName) {
    cout << "------------学生用プログラム------------" << endl;
    cout << clubName << "の学生としてログインしています。" << endl;
    // ここでclubsやuserStateなどのグローバル変数にアクセスできます
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        cout << "エラー：部活名が指定されていません。" << endl;
        return 1;
    }
    runStudentProgram(argv[1]);
    return 0;
}