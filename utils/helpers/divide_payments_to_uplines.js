const { users } = require('../../models');
const { divide_payments } = require('./payment_calculations');
const ADMIN_USER_ID = 0; // Admin user ID

// const zero_to_one = divide_payments(500);
// const one_to_two = divide_payments(1000);
// const two_to_three = divide_payments(2000);

const zero_to_one = [150, 50, 40, 35, 30, 15, 15, 15];
const one_to_two = [400, 80, 60, 50, 35, 25, 25, 25];
const two_to_three = [900, 150, 100, 70, 60, 40, 40, 40]

const divide_payments_to_uplines = async (user, payments_array, old_level, total_amount) => {
  try {
    const user_old_level = old_level;
    const user_new_level = user.subscription_level;
    // const level_diff = user_new_level - user_old_level;
    const maxLevel = 7; // Levels 0 through 7
    let totalDistributed = 0;
    let admin_accumulative_amount = 0;

    for (let level = 0; level <= maxLevel; level++) {
      let uplineId;
      switch (level) {
        case 0: uplineId = user?.invited_by; break;
        case 1: uplineId = user?.upline_one; break;
        case 2: uplineId = user?.upline_two; break;
        case 3: uplineId = user?.upline_three; break;
        case 4: uplineId = user?.upline_four; break;
        case 5: uplineId = user?.upline_five; break;
        case 6: uplineId = user?.upline_six; break;
        case 7: uplineId = user?.upline_seven; break;
        default: uplineId = null;
      }

      if (!uplineId || uplineId === 0) {
        console.log(`Level ${level}: No valid upline found, skipping.`);
        continue;
      }

      const uplineUser = await users.findOne({ where: { id: uplineId } });
      if (!uplineUser) {
        console.log(`Level ${level}: Upline user not found for ID ${uplineId}, skipping.`);
        continue;
      }

      const paymentAmount = payments_array[level] || 0;
      totalDistributed += paymentAmount;

      const uplineLevel = uplineUser.subscription_level;
      const levelDifference = user_new_level - user_old_level;

      // Direct upline always gets full payment
      if (level === 0) {
        uplineUser.available_balance = (uplineUser.available_balance || 0) + paymentAmount;
        uplineUser.direct_income = (uplineUser.direct_income || 0) + paymentAmount;

        console.log(`Level ${level}: Direct upline ${uplineId} receives full payment: ${paymentAmount}`);
      }

      if (level > 0) {
        // If User has greater subscription level than user in 
        if (uplineLevel >= user_new_level) {
          uplineUser.available_balance = (uplineUser.available_balance || 0) + paymentAmount;
          console.log(`Level ${level}: Upline ${uplineId} has greater subscirption so it receives full payment: ${paymentAmount}`);
        }
        else {




          if ((uplineLevel == 0 || levelDifference == 1)) {
            uplineUser.missed_balance = (uplineUser.missed_balance || 0) + paymentAmount;
            admin_accumulative_amount += paymentAmount;
            console.log(`Level ${level}: Upline ${uplineId} receives missed payment: ${paymentAmount}`);
          }

          if (levelDifference == 2) {
            if (uplineLevel == 1) {
              const level1Share = zero_to_one[level] || 0;
              const missedShare = one_to_two[level] || 0;
              uplineUser.available_balance = (uplineUser.available_balance || 0) + level1Share;
              uplineUser.missed_balance = (uplineUser.missed_balance || 0) + missedShare;
              admin_accumulative_amount += missedShare;

              console.log(`Level ${level}: Upline ${uplineId} receives missed payment: ${missedShare}`);
              console.log(`Level ${level}: Upline ${uplineId} sub level 1 receives available payment: ${level1Share}`);
            }

            if (uplineLevel === 2) {
              const level2Share = one_to_two[level] || 0;
              const missedShare = two_to_three[level] || 0;
              uplineUser.available_balance = (uplineUser.available_balance || 0) + level2Share;
              uplineUser.missed_balance = (uplineUser.missed_balance || 0) + missedShare;
              admin_accumulative_amount += missedShare;

              console.log(`Level ${level}: Upline ${uplineId} receives missed payment: ${missedShare}`);
              console.log(`Level ${level}: Upline ${uplineId} sub level 2 receives available payment: ${level2Share}`);
            }

            // if (uplineLevel == 0) {
            //   uplineUser.missed_balance = (uplineUser.missed_balance || 0) + paymentAmount;
            //   admin_accumulative_amount += paymentAmount;
            // }
          }

          if (levelDifference === 3) {
            let available = 0;
            let missed = 0;
            if (uplineLevel === 1) {
              available = zero_to_one[level] || 0;
              missed = (one_to_two[level] || 0) + (two_to_three[level] || 0);
            } else if (uplineLevel === 2) {
              available = (zero_to_one[level] || 0) + (one_to_two[level] || 0);
              missed = two_to_three[level] || 0;
            }
            uplineUser.available_balance = (uplineUser.available_balance || 0) + available;
            uplineUser.missed_balance = (uplineUser.missed_balance || 0) + missed;
            admin_accumulative_amount += missed;


            console.log(`User buy 0 ==>> 3 Subscription so payment distribution: `)
            console.log(`Level ${level}: Upline ${uplineId} receives missed payment: ${missed}`);
            console.log(`Level ${level}: Upline ${uplineId} receives available payment: ${available}`);
          }
        }
        uplineUser.level_income = (uplineUser.level_income || 0) + paymentAmount;
      }
      uplineUser.total_income = (uplineUser.total_income || 0) + paymentAmount;


      // Increment active counts only for new joiners
      if (user_old_level == 0) {
        if (level == 0) {
          uplineUser.active_direct = (uplineUser.active_direct || 0) + 1;
          uplineUser.active_team = (uplineUser.active_team || 0) + 1;
        } else {
          uplineUser.active_team = (uplineUser.active_team || 0) + 1;
        }
      }

      await uplineUser.save();
      console.log(`Level ${level}: Distributed ${paymentAmount} to upline ID ${uplineId}`);
    }

    console.log(`----------------------`)
    console.log(`----------------------`)
    console.log(`----------------------`)
    // Assign leftover + missed to admin
    console.log(`Admin Accumulative Amount: ${admin_accumulative_amount}`);
    console.log(`Total Distributed: ${totalDistributed}`);
    const remainingAmount = total_amount - totalDistributed + admin_accumulative_amount;
    console.log(`Remaining Amount: ${remainingAmount}`);
    console.log(`----------------------`)
    console.log(`----------------------`)
    console.log(`----------------------`)
    if (remainingAmount > 0) {
      const adminUser = await users.findOne({ where: { id: ADMIN_USER_ID } });
      if (adminUser) {
        adminUser.available_balance = (adminUser.available_balance || 0) + remainingAmount;
        adminUser.total_income = (adminUser.total_income || 0) + remainingAmount;
        await adminUser.save();
        console.log(`Assigned remaining ${remainingAmount} to admin ID ${ADMIN_USER_ID}`);
      } else {
        console.warn(`Admin user with ID ${ADMIN_USER_ID} not found.`);
      }
    }

    return { success: true, message: "Upline Payments Divided Successfully" };
  } catch (error) {
    console.error("Error dividing payments to uplines:", error);
    return { success: false, message: "Error dividing payments", error: error.message || error };
  }
};

module.exports = { divide_payments_to_uplines };
