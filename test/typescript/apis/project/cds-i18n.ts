import cds, { i18n } from "@sap/cds";
import { testType } from "./dummy";
const model = cds.reflect({});
const { Book: Books } = model.entities;

testType<string | undefined>(i18n.labels.for("foo"));
testType<string | undefined>(i18n.labels.at("foo"));
i18n.labels.at("foo", "bar");
i18n.labels.at("foo", "bar", [123, "baz"]);
i18n.labels.at("foo", [123, "baz"]);
i18n.labels.file = "";
// @ts-expect-error
i18n.labels.defaults = {
  foo: "bar",
};
// @ts-expect-error
i18n.labels.fallback = {
  foo: "bar",
};

testType<string | undefined>(i18n.messages.for("foo"));
testType<string | undefined>(i18n.messages.at("foo"));
i18n.messages.at("foo", "bar");
i18n.messages.at("foo", "bar", [123, "baz"]);
i18n.messages.at("foo", [123, "baz"]);

i18n.bundle4("foo", { file: "bar" });
i18n.labels.texts4("de");
i18n.labels.translations4("de");
i18n.labels.key4(Books);
i18n.messages.texts4("de");
i18n.messages.translations4("de");
i18n.messages.key4(Books);
cds.i18n.labels.for("foo");
cds.i18n === i18n;
