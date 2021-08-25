// função para geração de nickname aleatório que encontrei no link:
// https://qastack.com.br/programming/1349404/generate-random-string-characters-in-javascript
// onde fiz algumas modificações depois de entender o algoritmo.
module.exports = () => {
  let nickname = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 16; i += 1) {
    nickname += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return nickname;
};
