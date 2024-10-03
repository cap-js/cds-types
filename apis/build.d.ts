import { CSN } from './csn'

/**
 * WARNING: `cds.build` is only accessible during running `cds build` via the CDS SDK.
 * You can only use it in build contexts like registering a custom build plugin inside `cds-plugin.js`
 */
export namespace build {
  type TaskDefaults = { src?: string, dest?: string, options?: object } & Record<string, any>;
  type Task = { src: string, dest: string, for: string, options: object } & Record<string, any>;
  type Context = { options: Record<string, any>, tasks: Task[] };
  type FileWriter = {
    /**
     * @param {string} dest - absolute or relative file path. Relative paths will be resolved to this task's destination path.
     */
    to: (dest: string) => Promise<void>,
  };
  type Severity = 'Info' | 'Warning' | 'Error';

  /**
   * The build plugin creates the build output for a dedicated build task. It is uniquely identified
   * by the build task's `for` or `use` property. The `use` property represents
   * the fully qualified node module path of the build plugin implementation.
   *
   * The build task engine defines the following protocol. The methods are invoked in descending order:
   * - init() - optional
   * - get priority() - optional
   * - async clean()
   * - async build()
   *
   * The reflected CSN can be accessed using the async method `model()`.
   */
  abstract class Plugin {
    static taskDefaults: TaskDefaults
    static readonly INFO: Severity
    static readonly WARNING: Severity
    static readonly ERROR: Severity

    /**
     * Determines whether a task of this type will be created when cds build is executed,
     * @returns `true` by default
     */
    static hasTask(): boolean;

    /**
     * Returns the build task executed by this build plugin.
     */
    get task(): Task;

    /**
     * Returns a list of build and compiler messages created by this build plugin.
     * Supported message severities are 'Info', 'Warning', and 'Error'.
     */
    get messages(): string[];

    /**
     * Returns the list of files and folders written by this build plugin.
     */
    get files(): string[];

    /**
     * Returns the build context
     */
    get context(): Context;

    /**
     * Returns the priority of this plugin as number, where 1024 represents the default value
     * to ensure that custom plugins are by default executed before the built-in plugins.
     * The higher the priority value, the sooner the build plugin will be run.
     * The range of valid priority values is from -1024 to +1024.
     * Built-in plugins have a priority value range from 0 - 524.
     */
    get priority(): number;

    /**
     * Called by the framework immediately after this instance has been created.
     * The instance has already been fully initialized.
     */
    init(): void;

    /**
     * Called by the framework to create the artifacts of this build plugin.
     */
    abstract build(): Promise<void>;

    /**
     * Called by the framework immediately before 'build' to delete any output created by this build plugin.
     *
     * Note: The `BuildTaskEngine` is cleaning the common generation target folder if the build is
     * executed in staging mode, e.g. build.target: "gen".
     */
    clean(): Promise<void>;

    /**
     * Asynchronously write the given content to a given file path.
     * If the file exists the content is replaced. If the file does not exist, a new file will be created.
     * The file name is stored in the list of files written by this build plugin.
     * @param {any} data - If data is of type object the JSON-stringified version is written.
     * @returns {FileWriter} object to write the file asynchronously to its destination
     */
    write(data: any): FileWriter;

    /**
     * Asynchronously copies a single file or the entire directory structure from 'src' to 'dest', including subdirectories and files.
     *
     * Note: The file names are stored in the list of files written by this build plugin.
     *
     * @param {string} src The absolute or relative source path of the file or directory to copy.
     *                     Relative paths will be resolved to this task's source path.
     * @returns {FileWriter} object to copy the file asynchronously to its destination
     */
    copy(src: string): FileWriter;

    /**
     * Adds the given user message and severity to the list of messages issued by this build task.
     * <p>
     * User messages will be logged after CDS build has been finished based on the log-level that has been set.
     * By default messages with severity <em>warning</em> and <em>error</em> will be logged.
     * @param {string} message the message text
     * @param {string} severity the severity of the message, if ommitted 'Error' is used
     */
    pushMessage(message: string, severity?: Severity): void;

    /**
     * Returns a compiled CSN model according to the model paths defined by this build task.
     * The model includes model enhancements defined by feature toggles, if any.
     * @return {object} the compiled CSN model
     */
    model(): Promise<CSN>;

    /**
     * Returns a compiled base model CSN according to the model paths defined by this build task.
     * The base model does not include any model enhancements defined by feature toggles.
     * @return {CSN} the compiled base model CSN
     */
    baseModel(): Promise<CSN>;

    options(): { messages: string[] };

    /**
     * Adds the given fully qualified file path to the list of files that are written by this build task.
     */
    pushFile(filePath: string): void;
  }

  /**
   * Registers plugin class with the given identifier
   *
   * @param id identifier of plugin
   * @param plugin Plugin implementation that inherits from `cds.build.Plugin`
   */
  export function register(id: string, plugin: { new (): Plugin }): void;

  /**
   * Executes cds build in the directory defined by cds.root.
   *
   * @param {Record<string, any>} options - command options as defined by build command.
   */
  export function build(options: Record<string, any>): Promise<void>
}
