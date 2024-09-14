int light1 = 13;  // Arduino 的第 1 個燈泡接腳
int light2 = 12;  // Arduino 的第 2 個燈泡接腳
char command;

void setup() {
  pinMode(light1, OUTPUT);
  pinMode(light2, OUTPUT);
  Serial.begin(9600);  // 與 Node.js 應用進行通訊
}

void loop() {
  if (Serial.available() > 0) {
    command = Serial.read();  // 讀取從 Node.js 發來的命令
    
    if (command == '1') {
      digitalWrite(light1, HIGH);  // 打開第 1 個燈泡
      delay(3000);                 // 保持亮3秒
      digitalWrite(light1, LOW);   // 自動關閉
    } 
    else if (command == '3') {
      digitalWrite(light2, HIGH);  // 打開第 2 個燈泡
      delay(3000);                 // 保持亮3秒
      digitalWrite(light2, LOW);   // 自動關閉
    }
  }
}
