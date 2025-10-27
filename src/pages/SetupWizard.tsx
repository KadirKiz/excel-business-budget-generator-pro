import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppConfigStore } from '../store/slices/appConfigSlice';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Progress } from '../components/ui/progress';

const setupSchema = z.object({
  country: z.string().min(1),
  currency: z.enum(['CHF', 'EUR', 'USD', 'GBP']),
  locale: z.enum(['de-CH', 'en-US']),
  purpose: z.enum(['private', 'freelancer', 'small-business', 'enterprise']),
  companyName: z.string().optional(),
  logoUrl: z.string().optional(),
  fiscalStartMonth: z.number().min(1).max(12).optional(),
  fiscalStartDay: z.number().min(1).max(31).optional(),
});

type SetupFormData = z.infer<typeof setupSchema>;

export function SetupWizard() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const updateConfig = useAppConfigStore((state) => state.updateConfig);
  const [currentStep, setCurrentStep] = useState(1);

  const { register, handleSubmit, watch, setValue, formState: { errors }, trigger } = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    mode: 'onBlur',
    defaultValues: {
      country: 'CH',
      currency: 'CHF',
      locale: 'de-CH',
      purpose: 'private',
    },
  });

  const onSubmit = (data: SetupFormData) => {
    updateConfig(data);
    navigate('/dashboard');
  };

  const handleNext = async () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = await trigger(['country', 'currency', 'locale']);
    } else if (currentStep === 2) {
      isValid = await trigger(['purpose']);
    } else if (currentStep === 3) {
      // Step 3 is optional
      isValid = true;
    } else if (currentStep === 4) {
      isValid = await trigger(['fiscalStartMonth', 'fiscalStartDay']);
    }

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const steps = [
    { id: 1, title: 'Land & Währung' },
    { id: 2, title: 'Zweck & Typ' },
    { id: 3, title: 'Design & Branding' },
    { id: 4, title: 'Zeitraum' },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Setup Wizard</CardTitle>
          <CardDescription>
            Richten Sie Ihr Budget in wenigen Schritten ein
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Schritt {currentStep} von 4</span>
              <span>{Math.round((currentStep / 4) * 100)}%</span>
            </div>
            <Progress value={(currentStep / 4) * 100} />
            <div className="flex justify-between">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`text-xs ${step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  {step.id}. {step.title}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Step 1: Land & Währung */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="country">Land *</Label>
                  <Select defaultValue="CH" onValueChange={(value) => setValue('country', value)}>
                    <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CH">Schweiz</SelectItem>
                      <SelectItem value="DE">Deutschland</SelectItem>
                      <SelectItem value="AT">Österreich</SelectItem>
                      <SelectItem value="FR">Frankreich</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.country && <p className="text-sm text-red-500 mt-1">Bitte wählen Sie ein Land aus</p>}
                </div>

                <div>
                  <Label htmlFor="currency">Währung *</Label>
                  <Select defaultValue="CHF" onValueChange={(value) => setValue('currency', value as any)}>
                    <SelectTrigger className={errors.currency ? 'border-red-500' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CHF">CHF</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.currency && <p className="text-sm text-red-500 mt-1">Bitte wählen Sie eine Währung aus</p>}
                </div>

                <div>
                  <Label htmlFor="locale">Sprache *</Label>
                  <Select defaultValue="de-CH" onValueChange={(value) => setValue('locale', value as any)}>
                    <SelectTrigger className={errors.locale ? 'border-red-500' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="de-CH">Deutsch (Schweiz)</SelectItem>
                      <SelectItem value="en-US">English</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.locale && <p className="text-sm text-red-500 mt-1">Bitte wählen Sie eine Sprache aus</p>}
                </div>
              </div>
            )}

            {/* Step 2: Zweck */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="purpose">Zweck *</Label>
                  <Select defaultValue="private" onValueChange={(value) => setValue('purpose', value as any)}>
                    <SelectTrigger className={errors.purpose ? 'border-red-500' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Privat</SelectItem>
                      <SelectItem value="freelancer">Freelancer</SelectItem>
                      <SelectItem value="small-business">Kleines Unternehmen (KMU)</SelectItem>
                      <SelectItem value="enterprise">Unternehmen</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.purpose && <p className="text-sm text-red-500 mt-1">Bitte wählen Sie einen Zweck aus</p>}
                </div>
              </div>
            )}

            {/* Step 3: Design & Branding */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Firmenname (optional)</Label>
                  <Input {...register('companyName')} placeholder="Ihr Firmenname" />
                  <p className="text-sm text-muted-foreground mt-1">Optional: für Business-Accounts</p>
                </div>
                <div>
                  <Label htmlFor="logoUrl">Logo-URL (optional)</Label>
                  <Input {...register('logoUrl')} placeholder="https://..." />
                  <p className="text-sm text-muted-foreground mt-1">Optional: URL zu Ihrem Logo</p>
                </div>
              </div>
            )}

            {/* Step 4: Zeitraum */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fiscalStartMonth">Geschäftsjahr Start (Monat) *</Label>
                    <Input
                      {...register('fiscalStartMonth', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="12"
                      defaultValue={1}
                      className={errors.fiscalStartMonth ? 'border-red-500' : ''}
                    />
                    {errors.fiscalStartMonth && <p className="text-sm text-red-500 mt-1">Gültiger Monat erforderlich (1-12)</p>}
                  </div>
                  <div>
                    <Label htmlFor="fiscalStartDay">Geschäftsjahr Start (Tag) *</Label>
                    <Input
                      {...register('fiscalStartDay', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      max="31"
                      defaultValue={1}
                      className={errors.fiscalStartDay ? 'border-red-500' : ''}
                    />
                    {errors.fiscalStartDay && <p className="text-sm text-red-500 mt-1">Gültiger Tag erforderlich (1-31)</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                disabled={currentStep === 1}
              >
                Zurück
              </Button>

              {currentStep < 4 ? (
                <Button type="button" onClick={handleNext}>
                  Weiter
                </Button>
              ) : (
                <Button type="submit">Abschliessen</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

