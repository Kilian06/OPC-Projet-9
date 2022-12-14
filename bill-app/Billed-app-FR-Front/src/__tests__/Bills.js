/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import Bills from "../containers/Bills.js";
import mockStore from "../__mocks__/store";
import "@testing-library/jest-dom";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills); // '#employee/bills',

      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => a - b;
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });
});

// Test handleClickIconEye
describe("Given I am connected as an employee", () => {
  describe("When click on eye", () => {
    test("Then the modal will open", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const pageHtml = BillsUI({ data: bills });
      document.body.innerHTML = pageHtml;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const billsContainer = new Bills({
        document,
        onNavigate,
        localStorage: localStorageMock,
        store: null,
      });
      $.fn.modal = jest.fn(); // pour la gestion de la modal
      const firstEyeIcon = screen.getAllByTestId("icon-eye")[0]; // premier oeil
      fireEvent.click(firstEyeIcon); // click sur l'oeil
      expect(screen.getAllByTestId("imgmodal")).toBeTruthy(); // verification du testid pour voir si modal ouverte
    });
  });

  // Test handleClickNewBill
  describe("When i click on Nouvelle note de frais button ", () => {
    test("Then New bill page will open", () => {
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const billsPage = new Bills({
        document,
        onNavigate,
        store: null,
        bills: bills,
        localStorage: window.localStorage,
      });
      const btnNewBill = screen.getByTestId("btn-new-bill");
      fireEvent.click(btnNewBill);
      expect(screen.getByText("Envoyer une note de frais")).toBeTruthy();
    });
  });

  //test d'int??gration GET Bills
  describe("When i load bills (get bills)", () => {
    test("Then it should display bills", async () => {
      const billsNew = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      const billsmock = bills;
      const getBills = jest.fn(() => billsNew.getBills());
      const listBills = await getBills();
      expect(getBills).toHaveBeenCalled();
      console.log(listBills.length)
      expect(listBills.length).toBe(billsmock.length); // compare la longueur
    });
  });
});
