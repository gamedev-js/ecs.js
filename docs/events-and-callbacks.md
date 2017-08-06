## Entity

### enable event

  - emit in `engine.createEntity()` when entity instantiated.
  - emit when `entity.enabled` is true and the entity is enabled in hierarchy.
    - it also recursively emit `enable` event in child by depth first rule.
  - emit after `entity.clone()` finished and the entity is enabled in hierarhcy.
  - emit after `entity.deepClone()` finished and the entity is enabled in hierarhcy.

### disable event

  - emit in `entity.destroy()` during `engine._destroyEntity()`.
    - it also recursively emit `disable` event in child by depth first rule.

### parent-changed event

  - emit when `_onParentChanged` triggerred.

## Component

### onEnable

  - trigger in `engine._createComp()` when component instantiated.
  - trigger when entity enabled.