/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActiveEffectConfig}
 */
export class SW25ActiveEffectConfig extends ActiveEffectConfig {
  /** @override */
  static get defaultOptions() {
    //return mergeObject(super.defaultOptions, {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["sw25", "sheet", "active-effect-sheet"],
      template: "systems/sw25/templates/effect/active-effect-config.hbs",
    });
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve base data structure.
    const context = await super.getData();

    // Use a safe clone of the actor data for further operations.
    const effectData = context.effect;

    // Set  keyClassification and kename of exsisting keys
    for (let i = 0; i < effectData.changes.length; i++) {
      let change = effectData.changes[i];
      switch (change.key) {
        case "system.attributes.hitmod":
        case "system.attributes.dmod":
        case "system.lt":
        case "system.cr":
        case "system.attributes.dodgemod":
        case "system.attributes.ppmod":
        case "system.attributes.mppmod":
        case "system.attributes.dreduce":
        case "system.attributes.move.movemod":
          change.keyClassification = "battle";
          change.keyname = change.key.replace(/^system\./, "");
          break;
        case "system.hp.hpmod":
        case "system.mp.mpmod":
        case "system.abilities.dex.valuemodify":
        case "system.abilities.agi.valuemodify":
        case "system.abilities.str.valuemodify":
        case "system.abilities.vit.valuemodify":
        case "system.abilities.int.valuemodify":
        case "system.abilities.mnd.valuemodify":
        case "system.abilities.dex.efmodify":
        case "system.abilities.agi.efmodify":
        case "system.abilities.str.efmodify":
        case "system.abilities.vit.efmodify":
        case "system.abilities.int.efmodify":
        case "system.abilities.mnd.efmodify":
          change.keyClassification = "parameter";
          change.keyname = change.key.replace(/^system\./, "");
          break;
        case "system.attributes.scmod":
        case "system.attributes.cnmod":
        case "system.attributes.wzmod":
        case "system.attributes.prmod":
        case "system.attributes.mtmod":
        case "system.attributes.frmod":
        case "system.attributes.drmod":
        case "system.attributes.dmmod":
          change.keyClassification = "magicpower";
          change.keyname = change.key.replace(/^system\./, "");
          break;
        case "system.":
          change.key = "";
          break;
        case null:
        case "":
          change.keyname = "";
          break;
        default:
          change.keyClassification = "input";
          break;
      }
    }

    let effectVitResPC = game.settings.get("sw25", "effectVitResPC");

    return context;
  }
  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html
      .find(".select-keyClassification")
      .change(this._selectKeyClassification.bind(this));
    html.find(".select-keyname").change(this._selectKeyname.bind(this));
  }

  async _selectKeyClassification(event) {
    event.preventDefault();
    const selected = $(event.currentTarget).val();
    const index = $(event.currentTarget)
      .closest(".effect-change")
      .data("index");
    const effectData = this.object;
    const keytData = effectData.changes[index];

    keytData.keyClassification = selected;
    keytData.keyname = "";
    keytData.key = "";

    if (effectData.sheet.rendered)
      await effectData.sheet.render(true, { focus: false });
  }

  async _selectKeyname(event) {
    event.preventDefault();
    const selected = $(event.currentTarget).val();
    const index = $(event.currentTarget)
      .closest(".effect-change")
      .data("index");
    const effectData = this.object;
    const keytData = effectData.changes[index];
    const changeData = duplicate(effectData.changes); // Create a copy of changes array

    keytData.keyname = selected;
    keytData.key = "system." + selected;
    changeData[index].keyname = selected;
    changeData[index].key = "system." + selected;

    await this.object.update({ changeData });

    if (effectData.sheet.rendered)
      await effectData.sheet.render(true, { focus: false });
  }
}
