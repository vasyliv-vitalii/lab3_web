const { execSync } = require('child_process');

try {
  execSync('npx protoc --ts_proto_out=src/protobuf/generated --proto_path=src/protobuf src/protobuf/trade.proto', {
    stdio: 'inherit'
  });
  console.log('✅ Прото-файл згенеровано успішно');
} catch (err) {
  console.error('❌ Помилка генерації прото-файлу:', err.message);
  process.exit(1);
}
