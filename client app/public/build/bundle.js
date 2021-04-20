
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\App.svelte generated by Svelte v3.31.2 */

    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let div7;
    	let div1;
    	let form0;
    	let h10;
    	let t2;
    	let span0;
    	let t4;
    	let input0;
    	let t5;
    	let input1;
    	let t6;
    	let input2;
    	let t7;
    	let button0;
    	let t9;
    	let div2;
    	let form1;
    	let h11;
    	let t11;
    	let span1;
    	let t13;
    	let input3;
    	let t14;
    	let input4;
    	let t15;
    	let button1;
    	let t17;
    	let div6;
    	let div5;
    	let div3;
    	let h12;
    	let t19;
    	let p0;
    	let t21;
    	let button2;
    	let t23;
    	let div4;
    	let h13;
    	let t25;
    	let p1;
    	let t27;
    	let button3;
    	let div7_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			div7 = element("div");
    			div1 = element("div");
    			form0 = element("form");
    			h10 = element("h1");
    			h10.textContent = "Create Account";
    			t2 = space();
    			span0 = element("span");
    			span0.textContent = "or use your email for registration";
    			t4 = space();
    			input0 = element("input");
    			t5 = space();
    			input1 = element("input");
    			t6 = space();
    			input2 = element("input");
    			t7 = space();
    			button0 = element("button");
    			button0.textContent = "Sign Up";
    			t9 = space();
    			div2 = element("div");
    			form1 = element("form");
    			h11 = element("h1");
    			h11.textContent = "Sign in";
    			t11 = space();
    			span1 = element("span");
    			span1.textContent = "or use your account";
    			t13 = space();
    			input3 = element("input");
    			t14 = space();
    			input4 = element("input");
    			t15 = space();
    			button1 = element("button");
    			button1.textContent = "Sign In";
    			t17 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div3 = element("div");
    			h12 = element("h1");
    			h12.textContent = "Welcome Back!";
    			t19 = space();
    			p0 = element("p");
    			p0.textContent = "To keep connected with us please login with your\n\t\t\t\t\t\tpersonal info";
    			t21 = space();
    			button2 = element("button");
    			button2.textContent = "Sign In";
    			t23 = space();
    			div4 = element("div");
    			h13 = element("h1");
    			h13.textContent = "Hello, Friend!";
    			t25 = space();
    			p1 = element("p");
    			p1.textContent = "Enter your personal details and start journey with us";
    			t27 = space();
    			button3 = element("button");
    			button3.textContent = "Sign Up";
    			if (img.src !== (img_src_value = "")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "logo-img svelte-16vn696");
    			add_location(img, file, 7, 2, 90);
    			attr_dev(div0, "class", "logo svelte-16vn696");
    			add_location(div0, file, 6, 1, 69);
    			attr_dev(h10, "class", "svelte-16vn696");
    			add_location(h10, file, 15, 4, 305);
    			attr_dev(span0, "class", "svelte-16vn696");
    			add_location(span0, file, 16, 4, 333);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Name");
    			attr_dev(input0, "class", "svelte-16vn696");
    			add_location(input0, file, 17, 4, 385);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "placeholder", "Email");
    			attr_dev(input1, "class", "svelte-16vn696");
    			add_location(input1, file, 18, 4, 430);
    			attr_dev(input2, "type", "password");
    			attr_dev(input2, "placeholder", "Password");
    			attr_dev(input2, "class", "svelte-16vn696");
    			add_location(input2, file, 19, 4, 477);
    			attr_dev(button0, "class", "svelte-16vn696");
    			add_location(button0, file, 20, 4, 530);
    			attr_dev(form0, "action", "#");
    			attr_dev(form0, "class", "svelte-16vn696");
    			add_location(form0, file, 14, 3, 283);
    			attr_dev(div1, "class", "form-container sign-up-container svelte-16vn696");
    			add_location(div1, file, 13, 2, 233);
    			attr_dev(h11, "class", "svelte-16vn696");
    			add_location(h11, file, 25, 4, 649);
    			attr_dev(span1, "class", "svelte-16vn696");
    			add_location(span1, file, 26, 4, 670);
    			attr_dev(input3, "type", "email");
    			attr_dev(input3, "placeholder", "Email");
    			attr_dev(input3, "class", "svelte-16vn696");
    			add_location(input3, file, 27, 4, 707);
    			attr_dev(input4, "type", "password");
    			attr_dev(input4, "placeholder", "Password");
    			attr_dev(input4, "class", "svelte-16vn696");
    			add_location(input4, file, 28, 4, 754);
    			attr_dev(button1, "class", "svelte-16vn696");
    			add_location(button1, file, 29, 4, 807);
    			attr_dev(form1, "action", "#");
    			attr_dev(form1, "class", "svelte-16vn696");
    			add_location(form1, file, 24, 3, 627);
    			attr_dev(div2, "class", "form-container sign-in-container svelte-16vn696");
    			add_location(div2, file, 23, 2, 577);
    			attr_dev(h12, "class", "svelte-16vn696");
    			add_location(h12, file, 35, 5, 961);
    			attr_dev(p0, "class", "svelte-16vn696");
    			add_location(p0, file, 36, 5, 989);
    			attr_dev(button2, "class", "ghost svelte-16vn696");
    			attr_dev(button2, "id", "signIn");
    			add_location(button2, file, 40, 5, 1083);
    			attr_dev(div3, "class", "overlay-panel overlay-left svelte-16vn696");
    			add_location(div3, file, 34, 4, 915);
    			attr_dev(h13, "class", "svelte-16vn696");
    			add_location(h13, file, 47, 5, 1255);
    			attr_dev(p1, "class", "svelte-16vn696");
    			add_location(p1, file, 48, 5, 1284);
    			attr_dev(button3, "class", "ghost svelte-16vn696");
    			attr_dev(button3, "id", "signUp");
    			add_location(button3, file, 49, 5, 1350);
    			attr_dev(div4, "class", "overlay-panel overlay-right svelte-16vn696");
    			add_location(div4, file, 46, 4, 1208);
    			attr_dev(div5, "class", "overlay svelte-16vn696");
    			add_location(div5, file, 33, 3, 889);
    			attr_dev(div6, "class", "overlay-container svelte-16vn696");
    			add_location(div6, file, 32, 2, 854);

    			attr_dev(div7, "class", div7_class_value = " " + (/*sign_up*/ ctx[0]
    			? "container right-panel-active"
    			: "container") + " svelte-16vn696");

    			attr_dev(div7, "id", "container");
    			add_location(div7, file, 9, 1, 138);
    			attr_dev(main, "class", "svelte-16vn696");
    			add_location(main, file, 5, 0, 61);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(div0, img);
    			append_dev(main, t0);
    			append_dev(main, div7);
    			append_dev(div7, div1);
    			append_dev(div1, form0);
    			append_dev(form0, h10);
    			append_dev(form0, t2);
    			append_dev(form0, span0);
    			append_dev(form0, t4);
    			append_dev(form0, input0);
    			append_dev(form0, t5);
    			append_dev(form0, input1);
    			append_dev(form0, t6);
    			append_dev(form0, input2);
    			append_dev(form0, t7);
    			append_dev(form0, button0);
    			append_dev(div7, t9);
    			append_dev(div7, div2);
    			append_dev(div2, form1);
    			append_dev(form1, h11);
    			append_dev(form1, t11);
    			append_dev(form1, span1);
    			append_dev(form1, t13);
    			append_dev(form1, input3);
    			append_dev(form1, t14);
    			append_dev(form1, input4);
    			append_dev(form1, t15);
    			append_dev(form1, button1);
    			append_dev(div7, t17);
    			append_dev(div7, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div3, h12);
    			append_dev(div3, t19);
    			append_dev(div3, p0);
    			append_dev(div3, t21);
    			append_dev(div3, button2);
    			append_dev(div5, t23);
    			append_dev(div5, div4);
    			append_dev(div4, h13);
    			append_dev(div4, t25);
    			append_dev(div4, p1);
    			append_dev(div4, t27);
    			append_dev(div4, button3);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button2, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(button3, "click", /*click_handler_1*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*sign_up*/ 1 && div7_class_value !== (div7_class_value = " " + (/*sign_up*/ ctx[0]
    			? "container right-panel-active"
    			: "container") + " svelte-16vn696")) {
    				attr_dev(div7, "class", div7_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { debug } = $$props;
    	let sign_up = false;
    	const writable_props = ["debug"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, sign_up = false);
    	const click_handler_1 = () => $$invalidate(0, sign_up = true);

    	$$self.$$set = $$props => {
    		if ("debug" in $$props) $$invalidate(1, debug = $$props.debug);
    	};

    	$$self.$capture_state = () => ({ debug, sign_up });

    	$$self.$inject_state = $$props => {
    		if ("debug" in $$props) $$invalidate(1, debug = $$props.debug);
    		if ("sign_up" in $$props) $$invalidate(0, sign_up = $$props.sign_up);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sign_up, debug, click_handler, click_handler_1];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { debug: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*debug*/ ctx[1] === undefined && !("debug" in props)) {
    			console.warn("<App> was created without expected prop 'debug'");
    		}
    	}

    	get debug() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set debug(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            debug: true
        }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
