const { balance, constants, ether, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const { expect } = require('chai');

const RefundEscrow = artifacts.require('RefundEscrow');

contract('RefundEscrow', function (accounts) {
  const [ owner, beneficiary, refundee1, refundee2 ] = accounts;

  const amount = ether('54');
  const refundees = [refundee1, refundee2];

  it('requires a non-null beneficiary', async function () {
    await expectRevert(
      RefundEscrow.new(ZERO_ADDRESS, { from: owner }), 'evm: execution reverted',
    );
  });

  context('once deployed', function () {
    beforeEach(async function () {
      this.escrow = await RefundEscrow.new(beneficiary, { from: owner });
    });

    context('active state', function () {
      it('has beneficiary and state', async function () {
        expect(await this.escrow.beneficiary()).to.equal(beneficiary);
        expect(await this.escrow.state()).to.be.bignumber.equal('0');
      });

      it('accepts deposits', async function () {
        await this.escrow.deposit(refundee1, { from: owner, value: amount });

        expect(await this.escrow.depositsOf(refundee1)).to.be.bignumber.equal(amount);
      });

      it('does not refund refundees', async function () {
        await this.escrow.deposit(refundee1, { from: owner, value: amount });
        await expectRevert(this.escrow.withdraw(refundee1),
          'evm: execution reverted',
        );
      });

      it('does not allow beneficiary withdrawal', async function () {
        await this.escrow.deposit(refundee1, { from: owner, value: amount });
        await expectRevert(this.escrow.beneficiaryWithdraw(),
          'evm: execution reverted',
        );
      });
    });

    it('only the owner can enter closed state', async function () {
      await expectRevert(this.escrow.close({ from: beneficiary }),
        'evm: execution reverted',
      );

      const { logs } = await this.escrow.close({ from: owner });
      expectEvent.inLogs(logs, 'RefundsClosed');
    });

    context('closed state', function () {
      beforeEach(async function () {
        await Promise.all(refundees.map(refundee => this.escrow.deposit(refundee, { from: owner, value: amount })));

        await this.escrow.close({ from: owner });
      });

      it('rejects deposits', async function () {
        await expectRevert(this.escrow.deposit(refundee1, { from: owner, value: amount }),
          'evm: execution reverted',
        );
      });

      it('does not refund refundees', async function () {
        await expectRevert(this.escrow.withdraw(refundee1),
          'evm: execution reverted',
        );
      });

      it('allows beneficiary withdrawal', async function () {
        const balanceTracker = await balance.tracker(beneficiary);
        await this.escrow.beneficiaryWithdraw();
        expect(await balanceTracker.delta()).to.be.bignumber.equal(amount.muln(refundees.length));
      });

      it('prevents entering the refund state', async function () {
        await expectRevert(this.escrow.enableRefunds({ from: owner }),
          'evm: execution reverted',
        );
      });

      it('prevents re-entering the closed state', async function () {
        await expectRevert(this.escrow.close({ from: owner }),
          'evm: execution reverted',
        );
      });
    });

    it('only the owner can enter refund state', async function () {
      await expectRevert(this.escrow.enableRefunds({ from: beneficiary }),
        'evm: execution reverted',
      );

      const { logs } = await this.escrow.enableRefunds({ from: owner });
      expectEvent.inLogs(logs, 'RefundsEnabled');
    });

    context('refund state', function () {
      beforeEach(async function () {
        await Promise.all(refundees.map(refundee => this.escrow.deposit(refundee, { from: owner, value: amount })));

        await this.escrow.enableRefunds({ from: owner });
      });

      it('rejects deposits', async function () {
        await expectRevert(this.escrow.deposit(refundee1, { from: owner, value: amount }),
          'evm: execution reverted',
        );
      });

      it('refunds refundees', async function () {
        for (const refundee of [refundee1, refundee2]) {
          const balanceTracker = await balance.tracker(refundee);
          await this.escrow.withdraw(refundee, { from: owner });
          expect(await balanceTracker.delta()).to.be.bignumber.equal(amount);
        }
      });

      it('does not allow beneficiary withdrawal', async function () {
        await expectRevert(this.escrow.beneficiaryWithdraw(),
          'evm: execution reverted',
        );
      });

      it('prevents entering the closed state', async function () {
        await expectRevert(this.escrow.close({ from: owner }),
          'evm: execution reverted',
        );
      });

      it('prevents re-entering the refund state', async function () {
        await expectRevert(this.escrow.enableRefunds({ from: owner }),
          'evm: execution reverted',
        );
      });
    });
  });
});
