const divide_payments = async (amount) => {

  let pay_zero, pay_one, pay_two, pay_three, pay_four, pay_five, pay_six, pay_seven;
  switch (amount) {
    case 500:
      pay_zero = 150;
      pay_one = 50;
      pay_two = 40;
      pay_three = 35;
      pay_four = 30;
      pay_five = 15;
      pay_six = 15;
      pay_seven = 15;
      break;

    case 1000:
      pay_zero = 400;
      pay_one = 80;
      pay_two = 60;
      pay_three = 50;
      pay_four = 35;
      pay_five = 25;
      pay_six = 25;
      pay_seven = 25;
      break;

    case 2000:
      pay_zero = 900;
      pay_one = 150;
      pay_two = 100;
      pay_three = 70;
      pay_four = 60;
      pay_five = 40;
      pay_six = 40;
      pay_seven = 40;
      break;

    case 1500:
      pay_zero = 550;
      pay_one = 130;
      pay_two = 100;
      pay_three = 85;
      pay_four = 65;
      pay_five = 40;
      pay_six = 40;
      pay_seven = 40;
      break;

    case 3000:
      pay_zero = 1300;
      pay_one = 230;
      pay_two = 160;
      pay_three = 120;
      pay_four = 95;
      pay_five = 65;
      pay_six = 65;
      pay_seven = 65;
      break;

    case 3500:
      pay_zero = 1450;
      pay_one = 280;
      pay_two = 200;
      pay_three = 155;
      pay_four = 125;
      pay_five = 80;
      pay_six = 80;
      pay_seven = 80;
      break;
    default:
      break;
  }

  const temparray = [pay_zero, pay_one, pay_two, pay_three, pay_four, pay_five, pay_six, pay_seven]
  console.log(temparray)
  return temparray;
}


module.exports = { divide_payments }