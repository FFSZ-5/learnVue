import Watcher from 'core/observer/watcher'
import { warn } from 'core/util'

export let activeEffectScope: EffectScope | undefined

export class EffectScope {
  active = true
  effects: Watcher[] = []
  cleanups: (() => void)[] = []
  parent: EffectScope | undefined
  scopes: EffectScope[] | undefined
  _vm?: boolean
  private index: number | undefined
  constructor(detached = false) {
    if (!detached && activeEffectScope) {
      this.parent = activeEffectScope
      this.index =
        (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
          this
        ) - 1
    }
  }
  run<T>(fn: () => T): T | undefined {
    if (this.active) {
      const currentEffectScope = activeEffectScope
      try {
        activeEffectScope = this
        return fn()
      } finally {
        activeEffectScope = currentEffectScope
      }
    } else if (__DEV__) {
      warn(`cannot run an inactive effect scope.`)
    }
  }
  on() {
    activeEffectScope = this
  }
  off() {
    activeEffectScope = this.parent
  }
  stop(fromParent?: boolean) {
    if (this.active) {
      let i, l
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].teardown()
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]()
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true)
        }
      }
      // nested scope, dereference from parent to avoid memory leaks
      if (this.parent && !fromParent) {
        // optimized O(1) removal
        const last = this.parent.scopes!.pop()
        if (last && last !== this) {
          this.parent.scopes![this.index!] = last
          last.index = this.index!
        }
      }
      this.active = false
    }
  }
}

export function effectScope(detached?: boolean) {
  return new EffectScope(detached)
}

/**
 * @internal
 */
export function recordEffectScope(
  effect: Watcher,
  scope: EffectScope | undefined = activeEffectScope
) {
  if (scope && scope.active) {
    scope.effects.push(effect)
  }
}

export function getCurrentScope() {
  return activeEffectScope
}

export function onScopeDispose(fn: () => void) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn)
  } else if (__DEV__) {
    warn(
      `onScopeDispose() is called when there is no active effect scope` +
        ` to be associated with.`
    )
  }
}
