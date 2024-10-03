import cds from "@sap/cds";

class MyPlugin extends cds.build.Plugin {
  static taskDefaults: cds.build.TaskDefaults = { src: "." };
  async build(): Promise<void> {
    await this.write({ content: "" }).to("my target");

    const model = await this.model();
    model.definitions!["entity"].elements.ID;

    this.pushMessage("error message");
    this.pushMessage("warning message", cds.build.Plugin.WARNING);
    this.pushMessage("info message", "Info");

    // @ts-expect-error
    this.pushMessage("invalid severity", "aa");

    this.pushFile("./path-to-file");

    this.files[0].startsWith("");
    this.context.tasks.length;
    this.context.tasks.find(t => t.for === "nodejs");
    this.context.options.test === true
    this.messages.length

    this.task.src;
    this.task.dest;
  }
  get priority(): number {
    return -1;
  }
}

cds.build.register("custom", MyPlugin);

cds.build.build({})