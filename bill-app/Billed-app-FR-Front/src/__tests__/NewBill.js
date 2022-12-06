/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom";
import { fireEvent, screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import mockStore from "../__mocks__/store.js";
import router from "../app/Router.js";

jest.mock("../app/Store", () => mockStore);

describe("Given I am connected as an employee", () => {
  // Création de la page NewwBill pour chaque test

  Object.defineProperty(window, "localStorage", { value: localStorageMock });
  window.localStorage.setItem(
    "user",
    JSON.stringify({
      type: "Employee",
    })
  );
  const html = NewBillUI(); // Création de la page NexBill
  document.body.innerHTML = html;

  // Test pour vérifier l'apparition d'un message et de la désactivation du bouton lors du chargement d'une PJ
  describe("When i load a file with the wrong extension in the input form", () => {
    test("Then an error msg is not hidden and the sub is disable", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window,
        localStorage,
      });  
      const fichier = screen.getByTestId("file");
      const verifFormat = new File(["scan.pdf"], "scan.pdf", {
        type: "application/pdf",
      });
      userEvent.upload(fichier,verifFormat)
      expect(screen.getByTestId("btn-sub-newbill").disabled).toBe(true)
      expect(screen.getByTestId("msgErrorFormat").hidden).toBe(false)
    });
  });
  // Test pour vérifier la non apparition d'un message et de la réactivation du bouton lors du chargement d'une PJ
  describe("When i download the attached file in the correct format and i input information in the form ", () => {
    test("Then the sub is not disable, the error msg is hidden ans the form is sent", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window,
        localStorage,
      });  
      const fichier = screen.getByTestId("file");
      const verifFormat = new File(["scan"], "scan.png", {
        type: "image/png",
      });
      userEvent.upload(fichier,verifFormat)
      expect(screen.getByTestId("btn-sub-newbill").disabled).toBe(false)
      expect(screen.getByTestId("msgErrorFormat").hidden).toBe(true)
      const submitBill = jest.fn((e) => newBill.handleSubmit(e));
      screen
        .getByTestId("form-new-bill")
        .addEventListener("submit", submitBill);
      fireEvent.submit(screen.getByTestId("form-new-bill"));
      expect(submitBill).toHaveBeenCalled();
      expect(screen.getByTestId("btn-new-bill")).toBeTruthy();
    });
  });
});

// Début Test POST
// Création d'une bill schema complet
describe("Given I am connected as an employee", () => {
  describe("When I submit a bill with all information in input", () => {
    test("Then the bill is created and i return to the bill menu", async () => {
      const html = NewBillUI();
      document.body.innerHTML = html;

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "jeanmich@test.tld",
        })
      );

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      const validBill = {
        type: "Hôtel et logement",
        name: "soiree au negresco",
        date: "1989-01-02",
        amount: 1400,
        vat: 280,
        pct: 20,
        commentary: "soiree negresco",
        fileUrl: "../facture.jpg",
        fileName: "facture.jpg",
      };

      screen.getByTestId("expense-type").value = validBill.type;
      screen.getByTestId("expense-name").value = validBill.name;
      screen.getByTestId("amount").value = validBill.amount;
      screen.getByTestId("datepicker").value = validBill.date;
      screen.getByTestId("vat").value = validBill.vat;
      screen.getByTestId("pct").value = validBill.pct;
      screen.getByTestId("commentary").value = validBill.commentary;
      newBill.fileUrl = validBill.fileUrl;
      newBill.fileName = validBill.fileName;
      const form = screen.getByTestId("form-new-bill");
      fireEvent.submit(form);
      expect(screen.getByTestId("btn-new-bill")).toBeTruthy();
    });
  });
});

// Test Erreur 404 et 500 (idem dashboard)
describe("When an error occurs on API", () => {
  // Avant que le test commence
  beforeEach(() => {
    // On créé le dom, ainsi qu'un utilisateur de type Employee et on appelle le router
    jest.spyOn(mockStore, "bills");
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem(
      "user",
      JSON.stringify({ type: "Employee", email: "a@a" })
    );
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.appendChild(root);
    router();
  });

  // erreur 404
  test("fetches bills from an API and fails with 404 message error", async () => {
    mockStore.bills.mockImplementationOnce(() => {
      return {
        list: () => {
          // Si erreur 404, la promesse est rejetée
          return Promise.reject(new Error("Erreur 404"));
        },
      };
    });

    window.onNavigate(ROUTES_PATH.Bills);
    await new Promise(process.nextTick);
    const message = await screen.getByText(/Erreur 404/);
    expect(message).toBeTruthy();
  });

  // Erreur 500
  test("fetches messages from an API and fails with 500 message error", async () => {
    mockStore.bills.mockImplementationOnce(() => {
      return {
        list: () => {
          // Si erreur 500, la promesse est rejetée
          return Promise.reject(new Error("Erreur 500"));
        },
      };
    });

    window.onNavigate(ROUTES_PATH.Bills);
    await new Promise(process.nextTick);
    const message = await screen.getByText(/Erreur 500/);
    expect(message).toBeTruthy();
  });

});
