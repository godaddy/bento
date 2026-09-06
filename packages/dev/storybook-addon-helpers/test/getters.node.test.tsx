import { expectTypeOf, it, describe, expect } from 'vitest';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  getMeta,
  getStory,
  getVariants,
  getComponentDocs,
  getTypeDocs,
  getExamples
} from '../src/storybook/getters.ts';
import { Examples } from '../src/storybook/examples-marker.ts';

function TestComponent(props: { size: string; disabled?: boolean }) {
  return <div>Test {JSON.stringify(props)}</div>;
}

describe('getMeta', function getMetaSuite() {
  it('should pass type checking', function typeChecking() {
    getMeta({ title: 'test' });
    getMeta({
      title: 'test',
      component: TestComponent
    });

    getMeta({
      title: 'test',
      component: TestComponent,
      args: {
        size: 'sm',
        disabled: true,
        // @ts-expect-error unexpected prop
        wrong: 'wrong'
      }
    });

    type TestCompMetaArgs = Parameters<typeof getMeta<typeof TestComponent>>[0];

    expectTypeOf<TestCompMetaArgs>().toExtend<Meta<typeof TestComponent>>();

    expectTypeOf<TestCompMetaArgs['args']>().toExtend<{ size: string; disabled?: boolean } | undefined>();

    // @ts-expect-error unexpected prop
    expectTypeOf<TestCompMetaArgs['args']>().toExtend<{ wrong?: string } | undefined>();

    // @ts-expect-error invalid prop type
    expectTypeOf<TestCompMetaArgs['args']>().toExtend<{ size: number } | undefined>();
  });
});

describe('getStory', function getStorySuite() {
  it('should pass type checking', function typeChecking() {
    getStory(TestComponent);
    getStory(TestComponent, {});
    getStory(TestComponent, {
      args: {
        size: 'sm',
        disabled: true,
        // @ts-expect-error unexpected prop
        onClick: () => void 0
      }
    });

    type TestCompStoryObj = Parameters<typeof getStory<typeof TestComponent>>[1];
    type NonNullableTestCompStoryObj = NonNullable<TestCompStoryObj>;

    expectTypeOf<TestCompStoryObj>().toEqualTypeOf<StoryObj<typeof TestComponent> | undefined>();

    expectTypeOf<NonNullableTestCompStoryObj['args']>().toExtend<{ size?: string; disabled?: boolean } | undefined>();

    // @ts-expect-error unexpected prop
    expectTypeOf<NonNullableTestCompStoryObj['args']>().toExtend<{ wrong?: string } | undefined>();

    // @ts-expect-error invalid prop type
    expectTypeOf<NonNullableTestCompStoryObj['args']>().toExtend<{ size: number } | undefined>();
  });
});

describe('getComponentDocs', function getComponentDocsSuite() {
  it('accepts type-safe docs options', function typeChecking() {
    getComponentDocs(TestComponent);
    getComponentDocs(TestComponent, {
      include: ['size'],
      primary: ['size'],
      categories: { Main: ['size'] }
    });
    getComponentDocs(TestComponent, {
      include: [/^size/],
      categories: { Main: [/^size/] }
    });
    getComponentDocs(TestComponent, {
      exclude: ['disabled']
    });

    // @ts-expect-error include and exclude are mutually exclusive
    getComponentDocs(TestComponent, { include: ['size'], exclude: ['disabled'] });

    // Arbitrary string names are accepted (matchers are widened).
    getComponentDocs(TestComponent, { include: ['missing'] });

    type ReturnTypeTestCompProps = ReturnType<typeof getComponentDocs<typeof TestComponent>>;

    expectTypeOf<ReturnTypeTestCompProps>().toEqualTypeOf<StoryObj<typeof TestComponent>>();
  });
});

describe('getTypeDocs', function getTypeDocsSuite() {
  it('accepts type-safe docs options', function typeChecking() {
    const actual = getTypeDocs<{ a: string; b: number }>({
      include: ['a'],
      primary: ['a'],
      categories: { Required: ['a'] }
    });

    expectTypeOf<typeof actual>().toEqualTypeOf<StoryObj<{ a: string; b: number }>>();

    // Arbitrary string names are accepted (matchers are widened).
    getTypeDocs<{ a: string }>({ include: ['b'] });

    // @ts-expect-error include and exclude are mutually exclusive
    getTypeDocs<{ a: string; b: number }>({ include: ['a'], exclude: ['b'] });
  });
});

describe('getVariants', function getVariantsSuite() {
  it('should pass type checking', function typeChecking() {
    getVariants(TestComponent, {
      small: {
        args: {
          size: 'sm',
          disabled: true
        }
      },
      large: {
        args: {
          size: 'lg',
          disabled: false,
          // @ts-expect-error unexpected prop
          wrong: 'wrong'
        }
      }
    });

    // @ts-expect-error missing variants object
    getVariants(TestComponent);

    type VariantsObj = Parameters<typeof getVariants<typeof TestComponent>>[1];

    expectTypeOf<VariantsObj>().toEqualTypeOf<Record<string, StoryObj<typeof TestComponent>>>();
  });
});

describe('getExamples', function getExamplesSuite() {
  it('is a no-op at runtime', function noop() {
    expect(getExamples()).toEqual({});
    expect(getExamples('./examples')).toEqual({});
  });
});

describe('Examples', function examplesSuite() {
  it('is a no-op at runtime', function noop() {
    expect(Examples({ of: {} })).toBeNull();
    expect(Examples({})).toBeNull();
  });
});
