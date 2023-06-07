import { commonSelectors } from "Selectors/common";
import { usersText } from "Texts/manageUsers";
import { usersSelector } from "Selectors/manageUsers";
import { bulkUserUpload } from "Support/utils/manageUsers";
import * as common from "Support/utils/common";
import { path } from "Texts/common";
import { groupsSelector } from "Selectors/manageGroups";

describe("Bulk user upload", () => {
  const without_name = "cypress/fixtures/bulkUser/without_name - Sheet1.csv";
  const without_email = "cypress/fixtures/bulkUser/without_email - Sheet1.csv";
  const without_group = "cypress/fixtures/bulkUser/without_group - Sheet1.csv";
  const same_email = "cypress/fixtures/bulkUser/same_email - Sheet1.csv";
  const invalid_group_name =
    "cypress/fixtures/bulkUser/invalid_group_name - Sheet1.csv";
  const empty_first_and_last_name =
    "cypress/fixtures/bulkUser/empty_first_and_last_name - Sheet1.csv";
  const limit_exceeded_list =
    "cypress/fixtures/bulkUser/500_invite_users - Sheet1.csv";
  const without_firstName =
    "cypress/fixtures/bulkUser/without_firstname - Sheet1.csv";
  const without_lastName =
    "cypress/fixtures/bulkUser/without_lastname - Sheet1.csv";

  const invite_users =
    "cypress/fixtures/bulkUser/invite_users - Sheet1 - 500_invite_users - Sheet1.csv.csv";

  beforeEach(() => {
    cy.appUILogin();
    common.navigateToManageUsers();
  });

  it("Verfiy bulk user upload invalid files", () => {
    cy.get(usersSelector.buttonAddUsers).click();
    cy.get(usersSelector.buttonUploadCsvFile).click();

    bulkUserUpload(
      without_name,
      "without_name",
      "Invalid row(s): [first_name, last_name] in [11] row(s). No users were uploaded."
    );
    bulkUserUpload(
      without_email,
      "without_email",
      "Invalid row(s): [email] in [11] row(s). No users were uploaded."
    );

    bulkUserUpload(
      without_group,
      "without_group",
      "Invalid row(s): [groups] in [5] row(s). No users were uploaded."
    );

    // toast
    bulkUserUpload(
      same_email,
      "same_email",
      "User with such email already exists."
    );

    // Toast
    bulkUserUpload(
      invalid_group_name,
      "invalid_group_name",
      "Groups All-users, All-users, All-users, All-users, All-users, All-users, All-users, All-users, All-users, All-users, All-users doesn't exist. No users were uploaded"
    );

    bulkUserUpload(
      empty_first_and_last_name,
      "empty_first_and_last_name",
      "Invalid row(s): [first_name, last_name] in [1] row(s). No users were uploaded."
    );

    bulkUserUpload(
      limit_exceeded_list,
      "500_invite_users",
      "You can only invite 250 users at a time"
    );

    cy.get(usersSelector.inputFieldBulkUpload).selectFile(without_firstName, {
      force: true,
    });
    cy.get(usersSelector.uploadedFileData).should(
      "contain",
      "without_firstname"
    );
    cy.get(usersSelector.buttonUploadUsers).click();
    cy.get(".go2072408551")
      .should("be.visible")
      .and("have.text", "5 users are being added");

    cy.wait(1000);

    cy.get(usersSelector.buttonAddUsers).click();
    cy.get(usersSelector.buttonUploadCsvFile).click();
    cy.get(usersSelector.inputFieldBulkUpload).selectFile(without_lastName, {
      force: true,
    });
    cy.get(usersSelector.uploadedFileData).should(
      "contain",
      "without_lastname"
    );
    cy.get(usersSelector.buttonUploadUsers).click();
    cy.get(".go2072408551")
      .should("be.visible")
      .and("have.text", "5 users are being added");
  });

  it("Verify bulk user upload functionality", () => {
    cy.get(usersSelector.buttonAddUsers).click();
    cy.get(usersSelector.buttonUploadCsvFile).click();

    cy.get(usersSelector.inputFieldBulkUpload).selectFile(invite_users, {
      force: true,
    });
    cy.get(usersSelector.uploadedFileData).should("contain", "invite_users");
    cy.get(commonSelectors.cancelButton).click();

    cy.get(usersSelector.buttonAddUsers).click();
    cy.get(usersSelector.buttonUploadCsvFile).click();
    cy.get(usersSelector.inputFieldBulkUpload).selectFile(invite_users, {
      force: true,
    });
    cy.get(usersSelector.buttonUploadUsers).click();
    cy.get(".go2072408551")
      .should("be.visible")
      .and("have.text", "250 users are being added");
    cy.wait(500);
    common.searchUser("test12@gmail.com");
    cy.contains("td", "test12@gmail.com")
      .parent()
      .within(() => {
        cy.get("td small").should("have.text", "invited");
      });
    common.navigateToManageGroups();
    cy.get(groupsSelector.groupLink("Admin")).click();
    cy.get(groupsSelector.usersLink).click();
    cy.contains("test12@gmail.com").should("be.visible");
  });
});