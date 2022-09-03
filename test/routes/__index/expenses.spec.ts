import { loader as weekLoader } from "~/routes/__index/expenses/week.$week";
import { loader as weekDayLoader } from "~/routes/__index/expenses/week.$week.day.$day";
import { seed, teardown } from "cypress/seed";
import { mockCookieSession } from "test/mocks/mockUserSession";
import { user } from "cypress/fixtures/user.json";
import dayjs from "~/utils/dayjs";
import { should } from "chai";

describe("Expenses", () => {
  let request: Request;

  beforeEach(async () => {
    await teardown();
    await seed();

    request = new Request("localhost:8080", {
      headers: { cookie: await mockCookieSession("userId", user.id) },
    });
  });

  describe("week", () => {
    it("should display all expenses from specific week", async () => {
      const response: Response = await weekLoader({
        request,
        params: { week: "1" },
      });

      const data = await response.json();

      should().exist(data.expensesByTypeInWeek);
      should().exist(data.expensesByDateInWeek);
      should().exist(data.expensesAggregatedInWeek);

      const sumAmountInWeek = data.expensesByTypeInWeek.reduce(
        (prev: number, e: any) => prev + e._sum?.amount,
        0
      );
      expect(sumAmountInWeek).to.be.equal(
        data.expensesAggregatedInWeek._sum.amount ?? 0
      );
    });

    it("should redirect to the current week on non-number week value", async () => {
      const response: Response = await weekLoader({
        request,
        params: { week: "invalid-week" },
      });
      expect(response.status).to.be.equal(302);
      expect(response.headers.get("location")).to.be.equal(
        `/expenses/week/${dayjs().week()}`
      );
    });

    it("should redirect to the current week on out of range", async () => {
      let response: Response = await weekLoader({
        request,
        params: { week: "-1" },
      });
      expect(response.status).to.be.equal(302);
      expect(response.headers.get("location")).to.be.equal(
        `/expenses/week/${dayjs().week()}`
      );

      response = await weekLoader({
        request,
        params: { week: `${dayjs().week() + 1}` },
      });
      expect(response.status).to.be.equal(302);
      expect(response.headers.get("location")).to.be.equal(
        `/expenses/week/${dayjs().week()}`
      );
    });
  });

  describe("day in week", () => {
    it("should display all expenses on specific day", async () => {
      const response: Response = await weekDayLoader({
        request,
        params: { week: "1", day: "1" },
      });

      const data = await response.json();

      should().exist(data.expensesInWeek);
      should().exist(data.expensesInWeekday);
      should().exist(data.expensesAggregatedInWeek);
    });

    it("should redirect to start of the week on non-number day value", async () => {
      const response: Response = await weekDayLoader({
        request,
        params: { week: "1", day: "invalid-day" },
      });
      expect(response.status).to.be.equal(302);
      expect(response.headers.get("location")).to.be.equal(
        `/expenses/week/1/day/1`
      );
    });

    it("should redirect to start of the week on out of range day value", async () => {
      let response: Response = await weekDayLoader({
        request,
        params: { week: "1", day: "invalid-day" },
      });
      expect(response.status).to.be.equal(302);
      expect(response.headers.get("location")).to.be.equal(
        `/expenses/week/1/day/1`
      );

      response = await weekDayLoader({
        request,
        params: { week: "1", day: "0" },
      });
      expect(response.status).to.be.equal(302);
      expect(response.headers.get("location")).to.be.equal(
        `/expenses/week/1/day/1`
      );

      response = await weekDayLoader({
        request,
        params: { week: "1", day: "-6" },
      });
      expect(response.status).to.be.equal(302);
      expect(response.headers.get("location")).to.be.equal(
        `/expenses/week/1/day/1`
      );

      response = await weekDayLoader({
        request,
        params: { week: "1", day: "100" },
      });
      expect(response.status).to.be.equal(302);
      expect(response.headers.get("location")).to.be.equal(
        `/expenses/week/1/day/1`
      );
    });
  });
});
